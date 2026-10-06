import { create } from "zustand"
import { type TransitionParticipantMethodsType } from "@/types/TransitionTypes"

type TransitionStoreType = {
	// Bumped once per page mount by PageReadySignal
	readyToken: number,
	signalReady: () => void,
	// Gates every GSAP animation (see utils/gsap); false until the first page signals
	pageReady: boolean,
	setPageReady: (ready: boolean) => void,
	// The pathname actually on screen, which lags usePathname while a transition runs
	committedPathname: string | null,
	setCommittedPathname: (pathname: string) => void,
	participants: Record<string, TransitionParticipantMethodsType>,
	registerParticipant: (key: string, methods: TransitionParticipantMethodsType) => void,
	unregisterParticipant: (key: string, methods: TransitionParticipantMethodsType) => void
}

export const useTransitionStore = create<TransitionStoreType>(set => ({
	readyToken: 0,
	signalReady: () => set(state => ({ readyToken: state.readyToken + 1, pageReady: true })),
	pageReady: false,
	setPageReady: ready => set(state => state.pageReady === ready ? state : { pageReady: ready }),
	committedPathname: null,
	setCommittedPathname: pathname => set(state =>
		state.committedPathname === pathname ? state : { committedPathname: pathname }),
	participants: {},
	registerParticipant: (key, methods) => set(state => ({
		participants: { ...state.participants, [key]: methods },
	})),
	// Only drops the entry if it is still the same registration,
	// so a leaving page can't remove an arriving one
	unregisterParticipant: (key, methods) => set(state => {
		if (state.participants[key] !== methods) return state
		const participants = { ...state.participants }
		delete participants[key]
		return { participants }
	}),
}))
