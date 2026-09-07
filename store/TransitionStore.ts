import { create } from "zustand"
import { TransitionParticipantMethodsType } from "@/types/TransitionTypes"

type TransitionStoreType = {

	// Counter bumped once per page mount by PageReadySignal.
	readyToken: number
	signalReady: () => void

	// The pathname of what is actually ON SCREEN, which is not what usePathname says while a
	// transition is in flight: TransitionControl keeps rendering the outgoing tree until it commits,
	// and the router has already moved on by then. Written from commit(), so it changes in the very
	// set that swaps the page it describes.
	//
	// Null until the first commit — a server render, and the frames before TransitionControl's mount
	// effect runs. A reader wanting a pathname that early should fall back to usePathname, where the
	// two agree anyway because nothing has navigated yet.
	committedPathname: string | null
	setCommittedPathname: (pathname: string) => void

	// Keyed by participant name. Registered from a layout effect on mount, dropped on unmount,
	// so the set in here is always exactly what is on screen.
	participants: Record<string, TransitionParticipantMethodsType>
	registerParticipant: (key: string, methods: TransitionParticipantMethodsType) => void
	unregisterParticipant: (key: string, methods: TransitionParticipantMethodsType) => void
}

export const useTransitionStore = create<TransitionStoreType>(set => ({
	readyToken: 0,
	signalReady: () => set(state => ({ readyToken: state.readyToken + 1 })),

	committedPathname: null,
	setCommittedPathname: pathname => set(state =>
		state.committedPathname === pathname ? state : { committedPathname: pathname }
	),

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
