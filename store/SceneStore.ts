import { create } from "zustand"

const scenes: Record<string, boolean> = {}

const resolveScenesReady = () => {
	const ids = Object.keys(scenes)
	return ids.length > 0 && ids.every(id => scenes[id])
}

const publish = (state: SceneStoreType) => {
	const scenesReady = resolveScenesReady()
	return scenesReady === state.scenesReady ? state : { scenesReady }
}

type SceneStoreType = {

	scenesReady: boolean

	registerScene: (id: string) => void
	signalSceneReady: (id: string) => void
	unregisterScene: (id: string) => void
}

export const useSceneStore = create<SceneStoreType>(set => ({
	scenesReady: false,

	registerScene: id => {
		if (id in scenes) return
		scenes[id] = false
		set(publish)
	},

	signalSceneReady: id => {
		if (scenes[id] !== false) return
		scenes[id] = true
		set(publish)
	},

	unregisterScene: id => {
		if (!(id in scenes)) return
		delete scenes[id]
		set(publish)
	},
}))
