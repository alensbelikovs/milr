"use client"

import { useFrame } from "@react-three/fiber"
import { useSceneStore } from "@/store/SceneStore"

// Drop this inside a <Canvas> to report that its scene has drawn. The matching registerScene call
// lives on the canvas wrapper instead — see useSceneRegistration for why the two are split.
export default function SceneReadySetter({ id }: { id: string }) {
	// Left unguarded on purpose: signalSceneReady ignores every frame after the first, and re-arms
	// itself if the scene is ever re-registered, which a local "already signalled" ref would miss.
	useFrame(() => useSceneStore.getState().signalSceneReady(id))

	return null
}
