"use client"
import { Canvas } from "@react-three/fiber"
import HeroSceneGeometries from "@/components/hero/HeroSceneGeometries"
import SceneReadySetter from "@/components/common/SceneReadySetter"

export default function HeroSceneCanvas() {
	return (
		<div className="absolute inset-0">
			<Canvas>
				<HeroSceneGeometries />
				<SceneReadySetter id="hero-scene"/>
			</Canvas>
		</div>
	)
}