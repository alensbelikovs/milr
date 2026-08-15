"use client"

import { useLayoutEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSceneStore } from "@/store/SceneStore"

export default function SceneReadySetter({ id }: { id: string }) {
	const readyLocal = useRef<boolean>(false)
	const { registerScene, unregisterScene, signalSceneReady } = useSceneStore()

	// Before paint register scene into the store.
	useLayoutEffect(() => {
		registerScene(id)

		return () => unregisterScene(id)
	}, [])

	// On first frame, signal to store that scene has rendered.
	useFrame(() => {
		if (!readyLocal.current) {
			readyLocal.current = true
			signalSceneReady(id)
		}
	})

	return null
}