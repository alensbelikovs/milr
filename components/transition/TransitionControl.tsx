"use client"
import TransitionOverlay from "@/components/transition/TransitionOverlay"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname } from "next/navigation"
import { useLenis } from "lenis/react"
import { useContext, useEffect, useRef, useState } from "react"
import { useTransitionStore } from "@/store/TransitionStore"
import { useSceneStore } from "@/store/SceneStore"
import { TransitionToType } from "@/types/TransitionTypes"

// Failsafe after which to force a transition to end. Spent across BOTH waits below rather than
// granted to each: two of these in series is twenty seconds of opaque curtain on a page that never
// signalled, which reads as a dead site rather than a slow one.
const READY_FAILSAFE = 10000

// A project show page — /projects/<slug>, and nothing nested deeper.
const PROJECT_SHOW_PATH = /^\/projects\/[^/]+$/

// Find out transition type from current pathname (applied to transitionTo)
const resolveTransitionType = (pathname: string): TransitionToType => {
	if (pathname === "/" || PROJECT_SHOW_PATH.test(pathname)) {
		return TransitionToType.HERO
	}

	if (pathname === "/projects" || pathname === "/diary") {
		return TransitionToType.LIST
	}

	return TransitionToType.OTHER
}

// Resolves when readyToken in store advances past 'from' value. Awaits page load.
const waitForPageReady = (from: number, timeoutMs: number) => new Promise<void>(resolve => {
	// Resolve instantly if readyToken already advanced past 'from' value.
    if (useTransitionStore.getState().readyToken > from) { console.log('page ready (already committed)'); return resolve() }

	// Subscribe to store change
    const unsub = useTransitionStore.subscribe(state => {
		// When readyToken advances past 'from' value, clear fallback timeout and resolve promise.
        if (state.readyToken > from) { clearTimeout(timeout); unsub(); resolve(); console.log('page ready') }
    })

	// Fallback timeout to resolve after set duration if transition is stuck.
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => { console.warn('page ready FAILSAFE'); unsub(); resolve() }, timeoutMs)
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
const waitForScenesReady = (timeoutMs: number) => new Promise<void>(resolve => {
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
	if (everySceneReady(scenes, pending)) { console.log('scenes ready (already drawn)'); return resolve() }

	// Subscribe to store change
	const unsub = useSceneStore.subscribe(state => {
		// Once the last outstanding scene reports in, clear fallback timeout and resolve promise.
		if (everySceneReady(state.scenes, pending)) { clearTimeout(timeout); unsub(); resolve(); console.log('scenes ready') }
	})

	// Fallback timeout to resolve after set duration if transition is stuck
	const timeout: ReturnType<typeof setTimeout> = setTimeout(() => { console.warn('scenes ready FAILSAFE', pending); unsub(); resolve() }, timeoutMs)
})

// A participant that never registered, or one missing the method asked for, used to be swallowed
// whole by the optional chain: the reveal carried on as though the animation had played, so a scene
// that never entered looked exactly like one whose entrance was instantaneous. It is a real fault
// every time — the reveal is driving something that is not on screen — so it says so.
const callParticipant = async (key: string, method: string) => {
	const participant = useTransitionStore.getState().participants[key]

	if (!participant?.[method]) {
		console.warn(`[TransitionControl] no participant ${key}.${method} registered — skipped`)
		return
	}

	await participant[method]()
}

// Whether a participant is on screen to answer for a method, asked before calling rather than found
// out by calling. The warn above is right for the reveal — a route that should have animated and did
// not is a fault every time — but wrong for the same-path branch below, where having nothing to
// animate is the ordinary case on every route that is not a filtered list.
const hasParticipant = (key: string, method: string) =>
	Boolean(useTransitionStore.getState().participants[key]?.[method])

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

	// Closed over directly, where ListRouteShell has to hold the same value through a ref. The
	// difference is who reads it: that one registers a methods object on its FIRST render and never
	// re-registers, so a closure there would keep the undefined useLenis hands back before its store
	// subscription settles. This is read inside an effect keyed on pathname, rebuilt on every
	// navigation, and the one run where Lenis may still be unresolved is the mount — which does not
	// swap, and so never calls the function below.
	const lenis = useLenis()

	// Every navigation lands at the top of the page, and this is the only place that can promise it.
	//
	// Next's own scroll handling cannot: it keeps scroll position whenever the page element is still
	// in the viewport, so clicking a card from halfway down a grid can drop you halfway down the page
	// it opens. Nor should it — Lenis drives the real document scroll in root mode, and a native jump
	// moves window.scrollY outside its rAF loop, leaving Lenis's internal target on the old value so
	// the next wheel event pulls back against the jump.
	//
	// Called under an opaque curtain and BEFORE the commit, both deliberately. Under cover, so it
	// jumps rather than travels — a scroll nobody can see is time spent for nothing. Before, so the
	// incoming page mounts already at the top: ScrollReveal builds its ScrollTriggers on mount and
	// measures them against the scroll position it finds, so committing first and scrolling after
	// would leave every trigger on the new page measured against a position it no longer sits at.
	//
	// Falls back to the window when Lenis has yet to resolve, which is the frame or two after a hard
	// load. Skipped entirely when nothing is swapping in — a first load or a refresh is the browser's
	// own restoration to make, not ours to overrule.
	const scrollToTop = () => {
		if (lenis) {
			lenis.scrollTo(0, { immediate: true })
			return
		}
		window.scrollTo(0, 0)
	}

	// What the last commit's pathname was, so the second effect can tell a navigation that changed the
	// route from one that only changed the query.
	const pathnameRef = useRef(pathname)

	// Mounts new page, all checks that wait on things to get ready need to run after this. Both
	// effects below go through it, so the identity check that keeps a no-op commit from re-rendering
	// is written once and cannot drift between them.
	const commit = () => setCommitted(prev =>
		prev.component === children && prev.context === context
			? prev
			: { component: children, context }
	)

	useEffect(() => {
		const unfreeze = commit

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

				// Curtain is opaque and the page underneath is still the old one — see scrollToTop.
				scrollToTop()
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

			// One budget for everything the reveal waits on, opened here rather than at the top of the
			// flow so the fadeIn above does not eat into it. Each wait gets what is left of it.
			const deadline = Date.now() + READY_FAILSAFE
			const remaining = () => Math.max(0, deadline - Date.now())

			// Unfreeze content and await readyness of next page.
			unfreeze()

			await waitForPageReady(readyTokenCaptured, remaining())
			if (flow !== flowRef.current) return

			// Held here rather than inside the HERO branch so that everything registered from inside a
			// canvas — heroSceneGeometries among them — is in participants by the time the switch calls
			// it. Moved into the branch, the switch runs first and those calls silently no-op.
			//
			// What makes that hold is where a scene's ready signal comes from: SceneReadySetter sits in
			// the same <Suspense> as the geometries, so it cannot report a drawn frame until the commit
			// that mounted them — and registered their participant — has already happened.
			await waitForScenesReady(remaining())
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

	// The navigation the reveal above structurally cannot see: a search-param change.
	//
	// usePathname strips the query, so /projects?category=residential reads as /projects and the
	// effect keyed on it never re-runs. The router still hands down new children, but unfreeze only
	// ever runs inside reveal — so with nothing to call it, the frozen page would keep rendering the
	// old results for good. This effect is what commits them, and it is keyed on children so it hears
	// what pathname cannot say.
	//
	// It is a whole reveal of its own, and it plays the same beats as the one above: curtain down, swap
	// underneath, curtain up. What it leaves out is the scene wait, which has nothing to wait for on a
	// list, and the per-type switch, which has no branch to run.
	useEffect(() => {
		// A real navigation. The reveal above owns it, and has not committed yet — unfreeze runs after
		// its fadeIn — so committed is still stale here and the check below would misread it as work to
		// do. Only bring the ref up to date.
		if (pathnameRef.current !== pathname) {
			pathnameRef.current = pathname
			return
		}

		// Nothing new to show. True on first mount, where committed was seeded with these very refs,
		// and on any re-render that did not come from the router.
		if (committed.component === children && committed.context === context) return

		// The same counter the reveal claims from, deliberately: both write to committed, and two
		// flows allowed to finish in either order would let an older one land last and put the previous
		// results back. Sharing it means whichever started last wins, so a second chip clicked while the
		// first is still swapping supersedes it.
		//
		// It cuts the other way too — a swap starting mid-reveal would abort the reveal, and an aborted
		// reveal never reaches the line that lifts the curtain. That is unreachable rather than handled:
		// a reveal is only in flight while the overlay is opaque over the whole page, so there is no chip
		// to click, and nothing here navigates on its own (no router.refresh, no Sanity live mode). Add
		// either and this needs a way to hand the curtain back.
		const flow = ++flowRef.current

		async function swap() {
			// Asked rather than called, because callParticipant warns about a missing participant and a
			// route with no grid is the ordinary case, not a fault. Such a route commits bare: covering it
			// would raise a curtain with nothing to signal that it is safe to lower again, and the wait
			// below would sit out the full failsafe behind it.
			if (!hasParticipant('listRoute', 'scrollToTop')) { commit(); return }

			await callParticipant('transitionOverlay', 'fadeIn')
			if (flow !== flowRef.current) return

			// Under cover now, so the scroll jumps rather than travels.
			await callParticipant('listRoute', 'scrollToTop')
			if (flow !== flowRef.current) return

			// Read before the commit that causes the bump, exactly as the reveal does. What answers here is
			// the incoming ListRouteShell rather than PageReadySignal: the page is reconciled, not
			// remounted, so the page's own signal cannot fire twice for one mount.
			const readyTokenCaptured = useTransitionStore.getState().readyToken

			commit()

			await waitForPageReady(readyTokenCaptured, READY_FAILSAFE)
			if (flow !== flowRef.current) return

			// Not awaited, matching the reveal: the curtain lifts alongside ScrollReveal's entrance rather
			// than before it, so the cards are already rising as the white clears.
			callParticipant('transitionOverlay', 'fadeOut')
		}
		swap()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children, context, pathname])

	return (
		<main ref={mainRef} className="relative">
			<LayoutRouterContext.Provider value={committed.context}>
				{committed.component}
			</LayoutRouterContext.Provider>
			<TransitionOverlay />
		</main>
	)
}
