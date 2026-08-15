import { create } from "zustand"
import { TransitionParticipantMethodsType } from "@/types/TransitionTypes"

type TransitionStoreType = {

	// Counter bumped once per page mount by PageReadySignal / FallbackPageSignal.
	readyToken: number
	signalReady: () => void

	// Keyed by participant name. Registered from a layout effect on mount, dropped on unmount,
	// so the set in here is always exactly what is on screen.
	participants: Record<string, TransitionParticipantMethodsType>
	registerParticipant: (key: string, methods: TransitionParticipantMethodsType) => void
	unregisterParticipant: (key: string) => void
}

export const useTransitionStore = create<TransitionStoreType>(set => ({
	readyToken: 0,
	signalReady: () => set(state => ({ readyToken: state.readyToken + 1 })),

	participants: {},
	registerParticipant: (key, methods) => set(state => ({
		participants: { ...state.participants, [key]: methods },
	})),
	// Rebuilt without the key rather than set to undefined, so `key in participants` and the
	// optional chain in callParticipant agree about what is still mounted.
	unregisterParticipant: key => set(state => {
		if (!(key in state.participants)) return state
		const participants = { ...state.participants }
		delete participants[key]
		return { participants }
	}),
}))
