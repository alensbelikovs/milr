"use client"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

import { gsap, useGSAP } from "@/utils/gsap"
import { useAspect } from "@/hooks/useAspect"
import UV_PASS_THROUGH_VERT from "@/shaders/passThroughVert.glsl"
import PAINT_REVEAL_FRAG from "@/shaders/paintRevealFrag.glsl"

const ASPECT_W = 16
const ASPECT_H = 9
const PLANE_ASPECT = ASPECT_W / ASPECT_H

// Shader config. Both radii are measured in units of plane height, the space the shader's aspect
// correction puts distances in, so the circle stays round on a 16:9 plane.
const RADIUS_MIN = 0.5
const RADIUS_MAX = 1.0
// How deep the image's own luminance bites into that radius. Sized against RADIUS_MIN, not against a
// full-plane sweep: much larger and the resting circle is eaten away entirely.
const LUMA_DISPLACE = 0.5
const FALLOFF = 0.1

const REVEAL_DURATION = 0.8

export default function PaintSceneGeometries({ srcBefore, srcAfter }: { srcBefore: string, srcAfter: string }) {
	const scale = useAspect(ASPECT_W, ASPECT_H)

	// The click lands here rather than on a raycast against the plane, so it fires anywhere in the
	// section — the letterboxed margins around the plane included.
	const canvasElement = useThree((state) => state.gl.domElement)

	// Suspends until both images have decoded. They are the same source under different
	// post-processing, so one aspect read off the before-texture describes both.
	const [beforeTexture, afterTexture] = useLoader(THREE.TextureLoader, [srcBefore, srcAfter])

	// The actual material reference the timeline writes through
	const materialRef = useRef<THREE.ShaderMaterial>(null)

	const revealTimeline = useRef<gsap.core.Timeline>(null)

	// Which end the timeline is headed for. A ref, not state: nothing about a click changes what React
	// renders, only what the material's uniforms hold, and the r3f frameloop is already redrawing.
	const isRevealed = useRef(false)

	// A TEMPLATE, not the objects the shader reads.
	const uniforms = useMemo(() => ({
		uBeforeTexture: { value: beforeTexture },
		uAfterTexture: { value: afterTexture },
		uPlaneAspect: { value: PLANE_ASPECT },
		uImageAspect: { value: beforeTexture.image.width / beforeTexture.image.height },
		uRadiusMin: { value: RADIUS_MIN },
		uRadiusMax: { value: RADIUS_MAX },
		uLumaDisplace: { value: LUMA_DISPLACE },
		uFalloff: { value: FALLOFF },
		// Overwritten from the pointer every frame. Centred to start with, which is also where an
		// untouched state.pointer sits, so the circle rests dead centre until the cursor first moves.
		uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
		uProgress: { value: 0.0 },
	}), [beforeTexture, afterTexture])

	useGSAP(() => {
		const material = materialRef.current
		if (!material) return

		// A timeline rather than a bare tween: further effects get added at their own positions later
		// without the click handling below having to change.
		//
		// Note reverse() plays the ease backwards, so an out ease reads as an in ease on the way back —
		// swap to a symmetric inOut if the shrink should feel like the expand.
		revealTimeline.current = gsap.timeline({ paused: true })
			.fromTo(material.uniforms.uProgress,
				{ value: 0.0 },
				{ value: 1.0, duration: REVEAL_DURATION, ease: 'power4.out' },
				0
			)
	}, { dependencies: [uniforms] })

	// Kept out of the useGSAP above on purpose: with dependencies present, useGSAP defers its cleanup to
	// unmount, so a listener registered in there would be added a second time if the textures ever
	// changed. Keyed to the canvas element alone, this pairs its own add and remove.
	useEffect(() => {
		const toggleReveal = () => {
			const timeline = revealTimeline.current
			if (!timeline) return

			isRevealed.current = !isRevealed.current

			// play/reverse rather than restart: a click mid-flight turns the reveal around from wherever
			// it currently sits instead of snapping back to an end.
			if (isRevealed.current) timeline.play()
			else timeline.reverse()
		}

		canvasElement.addEventListener('click', toggleReveal)
		return () => canvasElement.removeEventListener('click', toggleReveal)
	}, [canvasElement])

	// The circle sits exactly under the cursor, so uOrigin is rewritten every frame rather than eased.
	// r3f's own event layer already maintains state.pointer in NDC on every pointer event over the
	// canvas, before any raycasting, so there is nothing to listen for here — and reading it off the
	// frame state rather than through useThree keeps this free of store subscriptions and re-renders.
	useFrame((state) => {
		const material = materialRef.current
		if (!material) return

		// NDC -> world (the plane sits at z=0, centred) -> plane-local uv. Dividing by the useAspect
		// scale is what makes it plane-local: the plane is contained inside the viewport, so a cursor in
		// the letterboxed margin lands outside 0..1 and the circle keeps tracking it off the edge.
		const origin = material.uniforms.uOrigin.value as THREE.Vector2
		origin.set(
			(state.pointer.x * state.viewport.width / 2) / scale[0] + 0.5,
			(state.pointer.y * state.viewport.height / 2) / scale[1] + 0.5,
		)
	})

	return (
		<mesh scale={scale}>
			<planeGeometry args={[1, 1, 1, 1]} />
			<shaderMaterial
				ref={materialRef}
				vertexShader={UV_PASS_THROUGH_VERT}
				fragmentShader={PAINT_REVEAL_FRAG}
				uniforms={uniforms}
			/>
		</mesh>
	)
}
