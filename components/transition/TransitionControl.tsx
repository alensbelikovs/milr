"use client"
import TransitionOverlay from "@/components/transition/TransitionOverlay"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname } from "next/navigation"
import { useLenis } from "lenis/react"
import { useContext, useEffect, useRef, useState } from "react"
import { useTransitionStore } from "@/store/TransitionStore"
import { useSceneStore } from "@/store/SceneStore"

// Failsafe after which to force a transition to end. Spent across BOTH waits below rather than
// granted to each: two of these in series is twenty seconds of opaque curtain on a page that never
// signalled, which reads as a dead site rather than a slow one.
const READY_FAILSAFE = 10000

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
// Nothing in this version of the site registers a scene yet, so in practice this takes the empty
// branch below and resolves in the same tick — the wait costs nothing. It is written now rather than
// deferred because the ordering it depends on is the awkward part, not the waiting: call it only
// AFTER waitForPageReady, which is what makes the registry read below the incoming page's rather
// than the outgoing one's. The page being left unregisters its scenes and the page arriving
// registers its own from a layout effect, all inside the commit that bumps readyToken. Layout
// effects run before the browser paints, so by the time this runs the registry is settled — nothing
// is on its way in.
const waitForScenesReady = (timeoutMs: number) => new Promise<void>(resolve => {
	// Snapshot taken once: what is registered at this instant is what this transition waits for, and
	// nothing that registers later can join. Deciding once is the point — the registry keeps moving
	// underneath (see everySceneReady) and a later reading of it is not this navigation's.
	const scenes = useSceneStore.getState().scenes
	const pending = Object.keys(scenes)

	// Nothing registered means this page has no scenes to wait on — every page, for now — so resolve
	// now. Subscribing instead would hang: with no scene to draw a frame, no store change is ever
	// coming and the transition would sit behind the curtain until the failsafe fires.
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

export default function TransitionControl({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const context = useContext(LayoutRouterContext)

	// Slot for what actually is rendered
	const [committed, setCommitted] = useState({ component: children, context })

	// Bumped by every reveal so a flow can tell it has been superseded. The effect re-runs on each
	// navigation and dev StrictMode double-invokes it, so more than one reveal can be in flight at
	// once — all of them driving the same participants, including those of a page on its way out.
	const flowRef = useRef(0)

	// Read inside an effect keyed on pathname, rebuilt on every navigation, and the one run where
	// Lenis may still be unresolved is the mount — which does not swap, and so never calls the
	// function below.
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
	// incoming page mounts already at the top: anything building a ScrollTrigger on mount measures it
	// against the scroll position it finds, so committing first and scrolling after would leave every
	// trigger on the new page measured against a position it no longer sits at.
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

	// Mounts new page, all checks that wait on things to get ready need to run after this.
	//
	// Publishing the pathname from in here, rather than leaving readers to call usePathname for
	// themselves, is what gives them the pathname of the page ON SCREEN. usePathname flips the moment
	// the router commits — while the curtain is still fading in over the page being left — and context
	// propagation reaches into the frozen tree regardless of its element identity, so a "see next"
	// list keyed on it would visibly reshuffle before the page it belongs to has gone.
	const commit = () => {
		useTransitionStore.getState().setCommittedPathname(pathname)
		setCommitted(prev =>
			prev.component === children && prev.context === context
				? prev
				: { component: children, context }
		)
	}

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

			await waitForScenesReady(remaining())
			if (flow !== flowRef.current) return

			// Lifting the curtain is the whole reveal, for now — no route animates an entrance of its
			// own yet. Left unawaited so that when one does, it plays alongside the white clearing
			// rather than behind it.
			callParticipant('transitionOverlay', 'fadeOut')
		}
		reveal()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	// A div rather than the <main> this used to render: the pages own that element themselves, and
	// one <main> nested inside another is invalid.
	return (
		<div className="relative">
			<LayoutRouterContext.Provider value={committed.context}>
				{committed.component}
			</LayoutRouterContext.Provider>
			<TransitionOverlay />
		</div>
	)
}
