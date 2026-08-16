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

	if (pathname === "/projects" || pathname === "/video-blog") {
		return TransitionToType.LIST
	}

	return TransitionToType.OTHER
}

// Resolves when readyToken in store advances past 'from' value. Awaits page load.
const waitForPageReady = (from: number) => new Promise<void>(resolve => {
	// Resolve instantly if readyToken already advanced past 'from' value.
    if (useTransitionStore.getState().readyToken > from) { console.log('page ready (already committed)'); return resolve() }

	// Subscribe to store change
    const unsub = useTransitionStore.subscribe(state => {
		// When readyToken advances past 'from' value, clear fallback timeout and resolve promise.
        if (state.readyToken > from) { clearTimeout(timeout); unsub(); resolve(); console.log('page ready') }
    })

	// Fallback timeout to resolve after set duration if transition is stuck.
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => { console.warn('page ready FAILSAFE'); unsub(); resolve() }, READY_FAILSAFE)
})

// Every id in 'pending' has reported drawn. An id missing from the registry counts as NOT ready: it
// has unregistered since the snapshot — a canvas torn down late, StrictMode's remount — and a scene
// that is gone must not answer for one that has yet to draw. Asking the live registry instead, with
// every() over its values, is what let an unregister satisfy the wait: every() over nothing is true.
const everySceneReady = (scenes: Record<string, boolean>, pending: string[]) =>
	pending.every(id => scenes[id] === true)

// Resolves when every scene the incoming page registered has drawn its first frame.
//
// Call it only AFTER waitForPageReady, which is what makes the registry read below the incoming
// page's rather than the outgoing one's: the page being left unregisters its scenes and the page
// arriving registers its own from a layout effect, all inside the commit that bumps readyToken.
// Layout effects run before the browser paints, so by the time this runs the registry is settled —
// nothing is on its way in.
const waitForScenesReady = () => new Promise<void>(resolve => {
	// Snapshot taken once: what is registered at this instant is what this transition waits for, and
	// nothing that registers later can join. Deciding once is the point — the registry keeps moving
	// underneath (see everySceneReady) and a later reading of it is not this navigation's.
	const scenes = useSceneStore.getState().scenes
	const pending = Object.keys(scenes)

	// Nothing registered means this page has no scenes to wait on — LIST and OTHER — so resolve now.
	// Subscribing instead would hang: with no scene to draw a frame, no store change is ever coming
	// and the transition would sit behind the curtain until the failsafe fires.
	if (pending.length === 0) { console.log('scenes ready (none registered)'); return resolve() }

	// Registered and already drawn. Reachable when waitForPageReady returned on its own failsafe,
	// long after the scenes settled, where waiting for a change that already happened stalls again.
	if (everySceneReady(scenes, pending)) return resolve()

	// Subscribe to store change
	const unsub = useSceneStore.subscribe(state => {
		// Once the last outstanding scene reports in, clear fallback timeout and resolve promise.
		if (everySceneReady(state.scenes, pending)) { clearTimeout(timeout); unsub(); resolve(); console.log('scenes ready') }
	})

	// Fallback timeout to resolve after set duration if transition is stuck
	const timeout: ReturnType<typeof setTimeout> = setTimeout(() => { console.warn('scenes ready FAILSAFE', pending); unsub(); resolve() }, READY_FAILSAFE)
})

const callParticipant = async (key: string, method: string) => {
	await useTransitionStore.getState().participants[key]?.[method]?.()
}

export default function TransitionControl({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const context = useContext(LayoutRouterContext)

	// Slot for what actually is rendered
	const [committed, setCommitted] = useState({ component: children, context })

	// Bumped by every reveal so a flow can tell it has been superseded. The effect re-runs on each
	// navigation and dev StrictMode double-invokes it, so more than one reveal can be in flight at
	// once — all of them driving the same participants, including those of a page on its way out.
	const flowRef = useRef(0)

	// Storing reference of wrapper to apply scroll lock
	const mainRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Mounts new page, all checks that wait on things to get ready need to run after this
		const unfreeze = () => setCommitted(prev =>
			prev.component === children && prev.context === context
				? prev
				: { component: children, context }
		)

		// Whether unfreeze above will actually mount something new — the same comparison it makes, read
		// before it runs. False on the reveal that runs at mount: committed was seeded with these very
		// refs, so nothing swaps in, nothing new signals ready, and there is no swap to cover.
		const willSwap = committed.component !== children || committed.context !== context

		async function reveal() {
			// Claims this flow. Re-read after every await below: a newer reveal bumps the ref, and the
			// flow that lost has no business driving participants any more.
			const flow = ++flowRef.current

			// Only a real swap needs covering. At mount the curtain is already opaque.
			if (willSwap) {
				await callParticipant('transitionOverlay', 'fadeIn')
				if (flow !== flowRef.current) return
			}

			// Find out what page transitioning to.
			const transitioningTo = resolveTransitionType(pathname)
			console.log(transitioningTo)
			
			// Baseline waitForPageReady() compares against: it resolves once readyToken passes this.
			// A swap means the page arriving has yet to signal, so wait for the count to pass what it
			// reads now. No swap means the committed page signalled before this effect ever ran —
			// passive effects run after the children's layout effects — so waiting for a further bump
			// waits on a mount that never happens, which is what left first load on the failsafe. 0
			// resolves on the signal already counted, and still waits if the page has yet to stream in.
			const readyTokenCaptured = willSwap ? useTransitionStore.getState().readyToken : 0

			// Unfreeze content and await readyness of next page.
			unfreeze()
			await waitForPageReady(readyTokenCaptured)
			if (flow !== flowRef.current) return

			// Held here rather than inside the HERO branch so that everything registered from inside a
			// canvas — heroSceneGeometries among them — is in participants by the time the switch calls
			// it. Moved into the branch, the switch runs first and those calls silently no-op.
			await waitForScenesReady()
			if (flow !== flowRef.current) return


			// Global chrome, so they enter ahead of the switch rather than inside every branch. Neither
			// is awaited: they run alongside whatever the branch below plays, not before it. Lifting the
			// curtain is every route's reveal, so it lives out here unconditionally — a branch cannot
			// forget it, and the page underneath is uncovered while its own entrance is already playing.
			callParticipant('navbar', 'navIn')
			callParticipant('transitionOverlay', 'fadeOut')

			// Run appropriate animations for each different transition type
			switch (transitioningTo) {
				case TransitionToType.HERO:
					Promise.all([
						callParticipant('heroSceneOverlay', 'dimmerIn'),
						callParticipant('heroSceneOverlay', 'headingIn'),
						callParticipant('heroSceneGeometries', 'geometriesIn'),
					])
					break
				case TransitionToType.LIST:
					// await list animation
					break
				case TransitionToType.OTHER:
					// Nothing of its own — the curtain lifting above is the whole reveal.
					break
			}
		}
		reveal()
	}, [pathname])

	return (
		<main ref={mainRef} className="relative">
			<LayoutRouterContext.Provider value={committed.context}>
				{committed.component}
			</LayoutRouterContext.Provider>
			<TransitionOverlay />
		</main>
	)
}
