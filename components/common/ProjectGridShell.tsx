"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import type { ReactNode } from "react"
import { useLenis } from "lenis/react"
import { ScrollTrigger } from "@/utils/gsap"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import { useTransitionStore } from "@/store/TransitionStore"

// Everything a grid of projects does beyond laying cards out. It renders no box of its own — the
// three jobs below are a scroll, a signal and a refresh, none of which need an element — so the grid
// keeps its place as the direct child of the section and nothing is inserted into the layout.
//
// Takes children rather than items, so ProjectGrid and ProjectGridItem stay server components. Same
// reason ScrollReveal takes children: ProjectGridItem builds Sanity image URLs, and pulling that
// into a client component drags the Sanity client into the browser bundle for nothing. It also keeps
// ProjectGrid's variant rhythm readable on the server — an array exported from a "use client" module
// comes back as a client-reference stub.
//
// Mount this KEYED on the filter and page. The key is what makes React tear the subtree down and
// build a new one instead of reconciling it, and a fresh mount is the only thing that re-runs
// ScrollReveal's useGSAP. Its ScrollTrigger is `once: true` — reconciled in place, it would already
// be spent, and the new cards would appear with no entrance at all.
//
// Registering a participant is also what marks this route as one that can be swapped behind the
// curtain at all: TransitionControl asks for the method below before it raises one.
export default function ProjectGridShell({ children }: { children: ReactNode }) {
	// Read through a ref rather than closed over, because useTransitionParticipant registers the
	// methods object from the FIRST render and never re-registers — see the hook. useLenis resolves
	// through a store subscription that settles in an effect, so the first render can see undefined,
	// and the method below would have captured that undefined for the life of the component.
	const lenis = useLenis()
	const lenisRef = useRef(lenis)
	lenisRef.current = lenis

	useTransitionParticipant("projectGrid", {
		// Called by TransitionControl's swap while the curtain is already opaque, which is what lets
		// this jump instead of animate: there is nothing on screen to watch it travel, and a scroll the
		// viewer cannot see is time spent for no reason.
		//
		// The top of the page rather than the top of the grid, so the heading comes back into view with
		// it — that is the one piece of the page that changed to name the filter just picked, and a new
		// set of results reads as a new page of them.
		scrollToTop: () => {
			lenisRef.current?.scrollTo(0, { immediate: true })
		},
	})

	// Reports the new grid the way a page reports itself, because for a filter change this IS the
	// arrival. The page component is reconciled rather than remounted — same route, same element type
	// — so PageReadySignal, which fires once on mount by design, has nothing to say about it. The
	// swap in TransitionControl waits on this bump before lifting the curtain, and without it there
	// would be nothing to wait on but a guess at how many frames a layout takes.
	//
	// It bumps on an ordinary arrival at /projects too, in the same commit as the page's own signal.
	// That changes nothing: a reveal resolves on the first bump past its baseline, and both land
	// together.
	useLayoutEffect(() => {
		useTransitionStore.getState().signalReady()
	}, [])

	// The swapped grid is a different height — a category with one project where there were five —
	// and every OTHER trigger on the page was measured against the old one. Footer and TextLineSplit
	// both hold some. This grid's own triggers are built fresh by the mount that runs this, so they
	// need nothing.
	//
	// A passive effect, so it runs after the browser has laid the new cards out. Children's effects
	// run before the parent's, so ScrollReveal has already created what this refreshes.
	useEffect(() => {
		ScrollTrigger.refresh()
	}, [])

	return <>{children}</>
}
