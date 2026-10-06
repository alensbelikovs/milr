"use client"
import { useContext, useEffect, useRef, useState } from "react"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname } from "next/navigation"
import { useLenis } from "lenis/react"
import TransitionOverlay from "@/components/transition/TransitionOverlay"
import { useTransitionStore } from "@/store/TransitionStore"
import { ScrollTrigger } from "@/utils/gsap"

// Longest the curtain waits for a page that never signals ready
const READY_FAILSAFE = 10000

// Holds the outgoing page on screen while the curtain fades in, then swaps in the new one and lifts
// the curtain once it has signalled ready
export default function TransitionControl({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const context = useContext(LayoutRouterContext)
	const lenis = useLenis()
	const [committed, setCommitted] = useState({ component: children, context })
	// Bumped by every reveal, so a superseded one can stop
	const flowRef = useRef(0)

	// Path plus query (a filter change on /work swaps the page too), without the hash
	const url = (context?.url ?? pathname).split("#")[0]

	useEffect(() => {
		const { getState, subscribe } = useTransitionStore
		const willSwap = committed.component !== children || committed.context !== context

		const callParticipant = async (key: string, method: string) => {
			const participant = getState().participants[key]
			if (participant?.[method]) await participant[method]()
			else console.warn(`[TransitionControl] no participant ${key}.${method}`)
		}

		async function reveal() {
			const flow = ++flowRef.current

			if (willSwap) {
				// The curtain is a GSAP tween, so the gate has to be open for it to move
				getState().setPageReady(true)
				await callParticipant("transitionOverlay", "fadeIn")
				if (flow !== flowRef.current) return

				// Under the curtain and before the swap, so the new page mounts at the top
				if (lenis) lenis.scrollTo(0, { immediate: true })
				else window.scrollTo(0, 0)
			}

			// On mount the page has already signalled, so any token counts
			const from = willSwap ? getState().readyToken : 0
			if (willSwap) getState().setPageReady(false)

			getState().setCommittedPathname(pathname)
			setCommitted(prev => prev.component === children && prev.context === context
				? prev
				: { component: children, context })

			await new Promise<void>(resolve => {
				if (getState().readyToken > from) return resolve()
				const timeout = setTimeout(() => {
					unsubscribe()
					resolve()
				}, READY_FAILSAFE)
				const unsubscribe = subscribe(state => {
					if (state.readyToken <= from) return
					clearTimeout(timeout)
					unsubscribe()
					resolve()
				})
			})
			if (flow !== flowRef.current) return

			// Remeasure triggers against the new page before it is revealed
			ScrollTrigger.refresh()
			// Opened here too, for a page that hit the failsafe
			getState().setPageReady(true)
			callParticipant("transitionOverlay", "fadeOut")
		}
		reveal()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url])

	return (
		<div className="relative">
			<LayoutRouterContext.Provider value={committed.context}>
				{committed.component}
			</LayoutRouterContext.Provider>
			<TransitionOverlay />
		</div>
	)
}
