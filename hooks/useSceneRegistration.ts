"use client"

import { useLayoutEffect } from "react"
import { useSceneStore } from "@/store/SceneStore"

// Announces a scene to SceneStore for as long as the component holding it is mounted. Belongs on the
// wrapper that renders the <Canvas>, NOT on anything inside it: canvas children live in r3f's own
// root, which is created from a measured layout effect a task or more after the page committed, so a
// scene registered from in there is still missing when TransitionControl asks. Registered out here it
// lands in the same commit as PageReadySignal — ahead of the transition's read, which is what lets an
// empty registry be read as "this page has no scenes".
//
// Keep it outside the canvas's own <Suspense> too. The point of registering is to claim a place in
// the wait BEFORE the scene could possibly be ready, and a registration that only appeared once the
// textures resolved is one the transition may well have already read past.
export function useSceneRegistration(id: string) {
	useLayoutEffect(() => {
		const { registerScene, unregisterScene } = useSceneStore.getState()
		registerScene(id)
		return () => unregisterScene(id)
	}, [id])
}
