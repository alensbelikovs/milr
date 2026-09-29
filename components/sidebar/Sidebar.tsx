"use client"
import { Fragment, useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { useTransitionStore } from "@/store/TransitionStore"

// Shared by the way in and the way out. expo.out both ways — which is why there are two timelines
// rather than one played in reverse: a reversed out ease is an in ease, and the panel would leave
// slowly and then snap off the edge instead of easing out of sight the way it eased in.
const SLIDE = { duration: 1, ease: "expo.out" }

export default function Sidebar() {
	const sidebarContent = useSidebarContentStore(state => state.sidebarContent)
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const committedPathname = useTransitionStore(state => state.committedPathname)
	const isOpen = sidebarContent !== null

	// What the panel is showing, which outlives what the store says it should: the store drops the
	// content the moment the sidebar is closed, and a panel emptied then would slide out blank. Held
	// on to until something new replaces it — off screen and inert by then, so nothing sees it.
	//
	// Adjusted during render rather than in an effect, which is React's own pattern for state that
	// follows a changing value: the new content is on screen in the same render that opened it,
	// rather than one frame late.
	//
	// contentKey counts every hand-over, and keys the content with it: each open, and each swap from
	// one piece of content to another, mounts it fresh. Without that React would reuse the instance
	// whenever the new content is the same type as the old — a second post clicked while the first
	// is open would re-render its title into a heading SplitText has already cut into lines, markup
	// React does not know it no longer owns. Fresh every time also means a body's entrance is simply
	// something it plays when it mounts. Closing hands nothing over, so the content stays mounted,
	// as it was, for the length of the exit.
	const [shownContent, setShownContent] = useState(sidebarContent)
	const [contentKey, setContentKey] = useState(0)
	if (sidebarContent !== null && sidebarContent !== shownContent) {
		setShownContent(sidebarContent)
		setContentKey(key => key + 1)
	}

	const scopeRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const backdropRef = useRef<HTMLDivElement>(null)
	const bodyRef = useRef<HTMLDivElement>(null)
	const openRef = useRef<gsap.core.Timeline | null>(null)
	const closeRef = useRef<gsap.core.Timeline | null>(null)

	// Both built once and kept. Each is a set of to() tweens, and each is invalidated before it is
	// played (see below), so either can start from wherever the other left the panel — a close
	// pressed halfway through an open turns around from the middle instead of jumping to the end
	// first.
	useGSAP(() => {
		const panel = panelRef.current
		const backdrop = backdropRef.current
		const body = bodyRef.current
		if (!panel || !backdrop || !body) return

		// translate-x-full holds the panel off screen for the server render, which has no GSAP. On
		// first touch GSAP folds that class into its own transform as a pixel x — the panel's width
		// at load — so x is zeroed here and xPercent alone does the moving from then on, in terms of
		// whatever width the panel has at the time.
		gsap.set(panel, { x: 0, xPercent: 100 })
		gsap.set(backdrop, { autoAlpha: 0 })

		// The body is back at full strength the instant an open starts — set, not tweened. Whatever
		// is being opened brings its own entrance (the menu's cascade), and a fade over the top of it
		// would only muddy that.
		openRef.current = gsap.timeline({ paused: true, defaults: SLIDE })
			.set(body, { opacity: 1 }, 0)
			.to(panel, { xPercent: 0 }, 0)
			.to(backdrop, { autoAlpha: 1 }, 0)

		// The body fades out over half the time the panel takes to leave, so the content is gone while the
		// panel is still well on screen — it reads as the panel emptying and then going, rather than
		// a page of content being carried off the edge. Derived from SLIDE, so it stays half if the
		// slide is ever retimed.
		closeRef.current = gsap.timeline({ paused: true, defaults: SLIDE })
			.to(panel, { xPercent: 100 }, 0)
			.to(backdrop, { autoAlpha: 0 }, 0)
			.to(body, { opacity: 0, duration: SLIDE.duration / 2 }, 0)
	}, { scope: scopeRef })

	// invalidate first, so the timeline re-reads where the panel is now instead of replaying from
	// wherever it was when it last ran. playTween pauses the other one before starting, so the two
	// never pull against each other.
	useEffect(() => {
		const tween = isOpen ? openRef.current : closeRef.current
		const counterpart = isOpen ? closeRef.current : openRef.current
		void playTween(tween?.invalidate() ?? null, { counterpart })
	}, [isOpen])

	// Lenis drives the real document scroll in root mode, so stopping IT is the lock. A body
	// overflow rule would leave Lenis's rAF loop running against a page that can no longer move,
	// and take a scrollbar's width of layout with it on the way in and out.
	//
	// Guarded because Lenis is unresolved for the frame or two after a hard load, the same window
	// TransitionControl falls back to the window for.
	const lenis = useLenis()
	useEffect(() => {
		if (!isOpen || !lenis) return
		lenis.stop()
		return () => lenis.start()
	}, [isOpen, lenis])

	useEffect(() => {
		if (!isOpen) return
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeSidebar()
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [isOpen, closeSidebar])

	// Any navigation dismisses the sidebar — back and forward included, which nothing in the panel
	// sees. Keyed on committedPathname rather than usePathname so it goes at the moment the page under
	// it is actually swapped. The menu's own links do not wait for this: they close the panel the
	// moment they are clicked, and by the time this runs it is already shut.
	useEffect(() => {
		closeSidebar()
	}, [committedPathname, closeSidebar])

	return (
		// Always mounted now, so it has to get out of the way when shut. inert takes the panel out of
		// the tab order and away from assistive tech — it is still in the DOM, holding its last
		// content, just off screen. pointer-events-none because the sheet itself is a full-screen box
		// over the page, and an empty box still catches the clicks meant for what is under it. Both
		// apply the moment it closes, so the page is usable while the panel is still sliding out.
		//
		// overflow-hidden so the panel parked past the right edge can never be scrolled to.
		<div
			ref={scopeRef}
			inert={!isOpen}
			className={`h-screen w-full grid grid-cols-12 fixed left-0 top-0 z-10 overflow-hidden
				${isOpen ? "" : "pointer-events-none"}`}>
			{/* Sibling of the panel rather than its parent, so a click anywhere on it is a click
			    on the page behind — nothing from the panel bubbles through here to be filtered.
			    opacity-0 invisible for the server render, before GSAP is there to set it. */}
			<div
				ref={backdropRef}
				className="absolute inset-0 bg-foreground/50 opacity-0 invisible"
				onClick={closeSidebar}/>
			{/* data-lenis-prevent, because a stopped Lenis still swallows the wheel: root mode binds
			    the listener to the whole document and preventDefaults everything it sees, so without
			    this the panel is reachable only by dragging its scrollbar. Lenis checks the attribute
			    on the event's composed path BEFORE it checks whether it is stopped, which is what
			    lets the wheel fall through to this element's native scroll while the page stays put. */}
			<div
				ref={panelRef}
				data-lenis-prevent
				className="bg-background col-span-full md:col-span-6 md:col-start-7 z-5 translate-x-full
				h-screen overflow-y-auto overscroll-contain scrollbar-background">
				{/* The content on its own, so it can fade while the panel's background slides on at full
				    strength — the panel stays a solid sheet to the edge, only what is on it goes.
				    h-full so the chain of heights reaches the content: a body sized min-h-full, to pin
				    something to the bottom of the panel, resolves that against this, and against a
				    height-auto wrapper it resolves to nothing. Content taller than the panel overflows
				    this and the panel scrolls it, the same as before. */}
				<div ref={bodyRef} className="h-full"><Fragment key={contentKey}>{shownContent}</Fragment></div>
			</div>
		</div>
	)
}
