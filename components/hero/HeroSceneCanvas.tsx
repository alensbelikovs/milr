"use client"
import { Canvas } from "@react-three/fiber"
import HeroSceneGeometries from "@/components/hero/HeroSceneGeometries"
import SceneReadySetter from "@/components/common/SceneReadySetter"
import { useSceneRegistration } from "@/hooks/useSceneRegistration"
import { gsap, useGSAP } from "@/utils/gsap"
import { useRef } from "react"

// Parallax lag, as a share of the canvas height.
const PARALLAX_Y_PERCENT = 25

export default function HeroSceneCanvas({ id }: { id: string }) {
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
				<HeroSceneGeometries />
				<SceneReadySetter id={id}/>
			</Canvas>
		</div>
	)
}
