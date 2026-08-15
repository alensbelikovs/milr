"use client"
import { useLoader } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import { useAspect } from "@/hooks/useAspect"
import { UV_PASS_THROUGH_VERT } from "@/shaders/passThroughVert"
import { HERO_FADE_IN_FRAG } from "@/shaders/heroFadeInFrag"

const TEXTURE_URL = "/placeholder.png"

const ASPECT_W = 16
const ASPECT_H = 9
const PLANE_ASPECT = ASPECT_W / ASPECT_H

const LUMA_DISPLACE = 1.0
const FALLOFF = 0.8

export default function HeroSceneGeometries() {
	const scale = useAspect(ASPECT_W, ASPECT_H)

	// Suspends until the image has decoded.
	const texture = useLoader(THREE.TextureLoader, TEXTURE_URL)

	// The actual material reference used for transition
	const materialRef = useRef<THREE.ShaderMaterial>(null)

	const revealTween = useRef<gsap.core.Tween>(null)

	// A TEMPLATE, not the objects the shader reads.
	const uniforms = useMemo(() => ({
		uTexture: { value: texture },
		uPlaneAspect: { value: PLANE_ASPECT },
		uImageAspect: { value: texture.image.width / texture.image.height },
		uLumaDisplace: { value: LUMA_DISPLACE },
		uFalloff: { value: FALLOFF },
		uRadius: { value: 0.0 },
	}), [texture])

	useGSAP(() => {
		const material = materialRef.current
		if (!material) return

		revealTween.current = gsap.fromTo(material.uniforms.uRadius,
			{ value: 0.0 },
			{ value: 1.0, duration: 1, ease: 'power1.out', paused: true }
		)
	}, { dependencies: [uniforms] })

	useTransitionParticipant('heroSceneGeometries', {
		geometriesIn: () => playTween(revealTween.current)
	})

	return (
		<mesh scale={scale}>
			<planeGeometry args={[1, 1, 1, 1]} />
			<shaderMaterial
				ref={materialRef}
				vertexShader={UV_PASS_THROUGH_VERT}
				fragmentShader={HERO_FADE_IN_FRAG}
				uniforms={uniforms}
			/>
		</mesh>
	)
}
