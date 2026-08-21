import { create } from "zustand"
import { TransitionParticipantMethodsType } from "@/types/TransitionTypes"

type TransitionStoreType = {

	// Counter bumped once per page mount by PageReadySignal.
	readyToken: number
	signalReady: () => void

	// Keyed by participant name. Registered from a layout effect on mount, dropped on unmount,
	// so the set in here is always exactly what is on screen.
	participants: Record<string, TransitionParticipantMethodsType>
	registerParticipant: (key: string, methods: TransitionParticipantMethodsType) => void
	unregisterParticipant: (key: string, methods: TransitionParticipantMethodsType) => void
}

export const useTransitionStore = create<TransitionStoreType>(set => ({
	readyToken: 0,
	signalReady: () => set(state => ({ readyToken: state.readyToken + 1 })),

	participants: {},
	registerParticipant: (key, methods) => set(state => ({
		participants: { ...state.participants, [key]: methods },
	})),

	// Drops the entry only if it is still the one that registered under this key, and rebuilds the
	// record without it rather than setting it to undefined, so `key in participants` and the optional
	// chain in callParticipant agree about what is still mounted.
	//
	// The identity check is what keeps an outgoing page from unregistering an incoming one. Every page
	// names its participants the same — two hero routes both register 'heroSceneGeometries' — and the
	// ones living inside a <Canvas> do not come and go with the DOM commit that swaps the pages: r3f
	// tears its root down asynchronously from a passive-effect cleanup, so the leaving canvas can run
	// this cleanup after the arriving one has already claimed the key. Deleting blind there would
	// leave the scene on screen unreachable, and callParticipant would no-op in silence.
	unregisterParticipant: (key, methods) => set(state => {
		if (state.participants[key] !== methods) return state
		const participants = { ...state.participants }
		delete participants[key]
		return { participants }
	}),
}))
