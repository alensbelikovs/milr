"use client"
import TransitionOverlay from "@/components/transition/TransitionOverlay"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { useTransitionStore } from "@/store/TransitionStore"
import { useSceneStore } from "@/store/SceneStore"
import { TransitionToType } from "@/types/TransitionTypes"

// Failsafe after which to force a transition to end.
const READY_FAILSAFE = 10000

// A project show page — /projects/<slug>, and nothing nested deeper.
const PROJECT_SHOW_PATH = /^\/projects\/[^/]+$/

// Find out transition type from current pathname (applied to transitionTo)
const resolveTransitionType = (pathname: string): TransitionToType => {
	if (pathname === "/" || PROJECT_SHOW_PATH.test(pathname)) {
		return TransitionToType.HERO
	}

	if (pathname === "/projects") {
		return TransitionToType.LIST
	}

	return TransitionToType.OTHER
}

// Resolves when readyToken in store advances past 'from' value. Awaits page load.
const waitForPageReady = (from: number) => new Promise<void>(resolve => {
	// Resolve instantly if readyToken already advanced past 'from' value.
    if (useTransitionStore.getState().readyToken > from) return resolve()

	// Subscribe to store change
    const unsub = useTransitionStore.subscribe(state => {
		// When readyToken advances past 'from' value, clear fallback timeout and resolve promise.
        if (state.readyToken > from) { clearTimeout(timeout); unsub(); resolve(); console.log('page ready') }
    })

	// Fallback timeout to resolve after set duration if transition is stuck.
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => { unsub(); resolve() }, 10000)
})

// Resolves when all scene records have their 'ready' boolean true.
// Instead of exposing records, store exposes global variable 'scenesReady',
// Which is true only once all scenes are ready.
const waitForScenesReady = () => new Promise<void>(resolve => {
	// Resolve instantly if every mounted scene has already drawn.
	if (useSceneStore.getState().scenesReady) return resolve()

	// Subscribe to store change
	const unsub = useSceneStore.subscribe(state => {
		// When scenesReady flips true, clear fallback timeout and resolve promise.
		if (state.scenesReady) { clearTimeout(timeout); unsub(); resolve(); console.log('scenes ready') }
	})

	// Fallback timeout to resolve after set duration if transition is stuck.
	const timeout: ReturnType<typeof setTimeout> = setTimeout(() => { unsub(); resolve() }, READY_FAILSAFE)
})

const callParticipant = async (key: string, method: string) => {
	await useTransitionStore.getState().participants[key]?.[method]?.()
}

const SCROLL_LOCK_CLASSES = ['h-screen', 'overflow-hidden']

const lockScroll = (target: HTMLDivElement | null) => {
	if (!target) return
	target.classList.add(...SCROLL_LOCK_CLASSES)
}

const unlockScroll = (target: HTMLDivElement | null) => {
	if (!target) return
	target.classList.remove(...SCROLL_LOCK_CLASSES)
}

export default function TransitionControl({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const context = useContext(LayoutRouterContext)

	// Slot for what actually is rendered.
	const [committed, setCommitted] = useState({ component: children, context })

	const prevPathname = useRef(pathname)

	// Storing reference of wrapper to apply scroll lock.
	const mainRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Mounts new page, all checks that wait on things to get ready need to run after this
		const unfreeze = () => setCommitted(prev =>
			prev.component === children && prev.context === context
				? prev
				: { component: children, context }
		)

		async function reveal() {
			// Captured before loading the next page.
			// When it bumps it means the next page has loaded.

			lockScroll(mainRef.current)

			// If not first load, run overlay exit logic.
			if (pathname !== prevPathname.current) {
				await callParticipant('transitionOverlay', 'fadeIn')
			}

			// Find out what page transitioning to.
			const transitioningTo = resolveTransitionType(pathname)
			
			// Page load token captured the moment before transition.
			// waitForPageReady() compares against this value, 
			// and when it increases, function's promise resolves.
			const readyTokenCaptured = useTransitionStore.getState().readyToken

			// Unfreeze content and await readyness of next page.
			unfreeze()
			await Promise.all([
				waitForPageReady(readyTokenCaptured),
				waitForScenesReady()
			])

			// Run appropriate animations for each different transition type
			switch (transitioningTo) {
				case TransitionToType.HERO:
					await callParticipant('transitionOverlay', 'setClear')
					Promise.all([
						callParticipant('heroSceneOverlay', 'dimmerIn'),
						callParticipant('heroSceneOverlay', 'headingIn'),
						callParticipant('heroSceneGeometries', 'geometriesIn'),
					])
					break
				case TransitionToType.LIST:
					await callParticipant('transitionOverlay', 'setClear')
					// await list animation
					break
				case TransitionToType.OTHER:
					await callParticipant('transitionOverlay', 'fadeOut')
					break
			}

			unlockScroll(mainRef.current)
			prevPathname.current = pathname
		}
		reveal()
	}, [pathname])

	return (
		<main ref={mainRef} className="relative h-screen overflow-hidden">
			<LayoutRouterContext.Provider value={committed.context}>
				{committed.component}
			</LayoutRouterContext.Provider>
			<TransitionOverlay />
		</main>
	)
}
