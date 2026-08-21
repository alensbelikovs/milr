"use client"
import { Canvas } from "@react-three/fiber"
import PaintSceneGeometries from "@/components/paint-scene/PaintSceneGeometries"
import SceneReadySetter from "@/components/transition/SceneReadySetter"
import { useSceneRegistration } from "@/hooks/useSceneRegistration"
import { Suspense, useRef } from "react"


export default function PaintSceneCanvas(
	{ id, srcBefore, srcAfter }:
	{ id: string, srcBefore: string, srcAfter: string })
{
	const scopeRef = useRef<HTMLDivElement>(null)

	useSceneRegistration(id)

	// cursor-pointer is the only affordance out here — the click itself is registered on the canvas
	// element from inside PaintSceneGeometries, next to the timeline it drives.
	return (
		<div ref={scopeRef} className="absolute inset-0 cursor-pointer">
			<Canvas>
				{/* Contains the useLoader suspension inside r3f's root rather than letting it escape
				    into the page — see HeroSceneCanvas for what that costs. */}
				<Suspense fallback={null}>
					<PaintSceneGeometries srcAfter={srcAfter} srcBefore={srcBefore}/>
					<SceneReadySetter id={id}/>
				</Suspense>
			</Canvas>
		</div>
	)
}
