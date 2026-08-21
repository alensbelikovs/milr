"use client"
import { Canvas } from "@react-three/fiber"
import HeroSceneGeometries from "@/components/hero-scene/HeroSceneGeometries"
import SceneReadySetter from "@/components/transition/SceneReadySetter"
import { useSceneRegistration } from "@/hooks/useSceneRegistration"
import { gsap, useGSAP } from "@/utils/gsap"
import { Suspense, useRef } from "react"

// Parallax lag, as a share of the canvas height.
const PARALLAX_Y_PERCENT = 25

export default function HeroSceneCanvas({ id, src }: { id: string, src: string }) {
	const scopeRef = useRef<HTMLDivElement>(null)

	// Claims the scene here, in the page's tree, so the transition knows to wait for it before the
	// canvas below has measured itself. SceneReadySetter inside the canvas closes the loop.
	useSceneRegistration(id)

	useGSAP(() => {
		gsap.fromTo(scopeRef.current,
			{ yPercent: 0 },
			{
				yPercent: PARALLAX_Y_PERCENT,
				ease: "none",
				scrollTrigger: {
					trigger: document.documentElement,
					start: "top top",
					end: "+=100%",
					scrub: true,
				},
			}
		)
	}, { scope: scopeRef })

	return (
		<div ref={scopeRef} className="absolute inset-0">
			<Canvas>
				{/* Catches the useLoader suspension INSIDE r3f's own root, which is the whole point of
				    it being here. Left to escape, it reaches r3f's outermost fallback — a <Block> that
				    throws a promise resolving to NOTHING out of the DOM <Canvas> component — and from
				    there it is the app's problem: with no <Suspense> above it, that stalls every commit
				    in the React root until the texture lands, and with one, the page is hidden instead,
				    which destroys the layout effects holding this very registration, reverts each
				    useGSAP context (killing entrance tweens mid-flight) and starts r3f's own canvas
				    teardown from the passive-effect cleanup. Either way readiness stops meaning
				    anything. Contained here, none of it happens.

				    SceneReadySetter sits inside the boundary too, so its frame count starts when there
				    is finally something to draw, and null is the fallback because the curtain is what
				    covers the gap — a placeholder would only draw a frame nobody asked for. */}
				<Suspense fallback={null}>
					<HeroSceneGeometries src={src}/>
					<SceneReadySetter id={id}/>
				</Suspense>
			</Canvas>
		</div>
	)
}
