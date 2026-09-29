"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSceneStore } from "@/store/SceneStore"

// Completed draws to wait for before calling the scene ready. The first gl.render is where a canvas
// pays for itself all at once — linkProgram for its shaderMaterial, texImage2D for every texture the
// suspended useLoader only decoded — and that stall is what the curtain exists to cover. One would
// do; two buys a spare frame for the cost of ~16ms nobody sees.
const DRAWN_FRAMES = 2

// Drop this inside a <Canvas>, in the SAME <Suspense> as the scene's contents — mounting alongside
// them is what makes the count below mean "this scene has drawn". The matching registerScene call
// lives on the canvas wrapper instead — see useSceneRegistration for why the two are split.
export default function SceneReadySetter({ id }: { id: string }) {
	// Counted here, from this component's own mount, rather than read off gl.info.render.frame.
	//
	// That counter belongs to the RENDERER, not to this scene, and three bumps it on entry to every
	// render() without ever resetting it. r3f flags a root active and starts its loop the moment the
	// root's Provider commits — which is the commit that renders the SUSPENSE FALLBACK when useLoader
	// is still fetching — so the renderer spends the whole load drawing an empty scene and arrives at
	// the scene's first real frame with a count already far past DRAWN_FRAMES. Read that way the gate
	// opened one tick BEFORE the expensive first draw on a cold texture and behaved correctly only on
	// a warm loader cache, which is what made readiness look random.
	//
	// useFrame subscribers run ahead of gl.render in the same tick, so a tick that returns early is a
	// draw that has yet to happen: signalling on tick DRAWN_FRAMES means DRAWN_FRAMES renders of this
	// scene have been through, and the one that pays for the programs and textures is behind us.
	const drawnFrames = useRef(0)

	useFrame(() => {
		if (drawnFrames.current++ < DRAWN_FRAMES) return

		// Left unguarded on purpose: signalSceneReady ignores every frame after the first, and re-arms
		// itself if the scene is ever re-registered, which a local "already signalled" ref would miss.
		useSceneStore.getState().signalSceneReady(id)
	})

	return null
}
