import { create } from "zustand"

const log = (event: string, id: string, scenes: Record<string, boolean>) => {
	const entries = Object.entries(scenes)
	const lines = entries.map(([sceneId, ready]) => `\n  ${sceneId}: ${ready}`).join("")
	console.log(`[SceneStore] ${event}: ${id} | scenes: ${entries.length}${lines}`)
}

type SceneStoreType = {

	// Scene id → has it drawn a frame yet. Held as state rather than reduced to one readiness flag:
	// a reader needs to tell an empty registry ("this page has no scenes, nothing to wait for") from
	// a full one that has not drawn yet, and a single boolean collapses those two into each other.
	// Registration is keyed to mount, so what is in here is always exactly what is on screen.
	scenes: Record<string, boolean>

	registerScene: (id: string) => void
	signalSceneReady: (id: string) => void
	unregisterScene: (id: string) => void
}

export const useSceneStore = create<SceneStoreType>((set, get) => ({
	scenes: {},

	registerScene: id => {
		if (id in get().scenes) return
		set(state => ({ scenes: { ...state.scenes, [id]: false } }))
		log("register", id, get().scenes)
	},

	// Guarded on the stored value, not on a caller-side "already signalled" flag, so it stays a
	// no-op when called from a frame loop and re-arms if the same id is ever registered again.
	signalSceneReady: id => {
		if (get().scenes[id] !== false) return
		set(state => ({ scenes: { ...state.scenes, [id]: true } }))
		log("ready", id, get().scenes)
	},

	// Rebuilt without the key rather than set to undefined, so `id in scenes` and the length a
	// transition reads off this registry agree about what is still mounted.
	unregisterScene: id => {
		if (!(id in get().scenes)) return
		set(state => {
			const scenes = { ...state.scenes }
			delete scenes[id]
			return { scenes }
		})
		log("unregister", id, get().scenes)
	},
}))
