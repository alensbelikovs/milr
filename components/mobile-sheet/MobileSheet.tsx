"use client"
import { Fragment, useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useMobileSheetStore } from "@/store/MobileSheetStore"
import { useTransitionStore } from "@/store/TransitionStore"

// Sidebar's slide, mirrored to come in from the left — the sidebar owns the right edge. Two timelines for the same reason as there: a
// reversed out ease is an in ease, and the panel would leave slowly and then snap off the edge.
const SLIDE = { duration: 1, ease: "expo.out" }

export const MOBILE_SHEET_ID = "mobile-sheet"

// The full-screen sheet below lg: Sidebar's counterpart for what a phone has no room to lay out
// inline — the section jump links, the work filters. The shell only slides and locks; what it holds
// comes from MobileSheetStore, put there by whichever trigger opened it, and brings its own landmark,
// scroll and footer (see MobileSheetBody).
//
// Mounted once in the layout, like Sidebar, so it survives a navigation and is there for any page
// that wants it.
export default function MobileSheet() {
	const content = useMobileSheetStore(state => state.content)
	const close = useMobileSheetStore(state => state.close)
	const committedPathname = useTransitionStore(state => state.committedPathname)
	const isOpen = content !== null

	// Held past the close and keyed per hand-over, exactly as Sidebar does and for the same reasons:
	// a sheet emptied the moment it closes would slide out blank, and each open mounts its body fresh.
	const [shownContent, setShownContent] = useState(content)
	const [contentKey, setContentKey] = useState(0)
	if (content !== null && content !== shownContent) {
		setShownContent(content)
		setContentKey(key => key + 1)
	}

	const scopeRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const bodyRef = useRef<HTMLDivElement>(null)
	const openRef = useRef<gsap.core.Timeline | null>(null)
	const closeRef = useRef<gsap.core.Timeline | null>(null)

	useGSAP(() => {
		const panel = panelRef.current
		const body = bodyRef.current
		if (!panel || !body) return

		// -translate-x-full holds the panel off screen for the server render. GSAP folds that into a
		// pixel x on first touch, so x is zeroed and xPercent does the moving from here on.
		gsap.set(panel, { x: 0, xPercent: -100 })

		openRef.current = gsap.timeline({ paused: true, defaults: SLIDE })
			.set(body, { opacity: 1 }, 0)
			.to(panel, { xPercent: 0 }, 0)

		// The content fades over half the slide, so the sheet empties and then goes — see Sidebar.
		closeRef.current = gsap.timeline({ paused: true, defaults: SLIDE })
			.to(panel, { xPercent: -100 }, 0)
			.to(body, { opacity: 0, duration: SLIDE.duration / 2 }, 0)
	}, { scope: scopeRef })

	useEffect(() => {
		const tween = isOpen ? openRef.current : closeRef.current
		const counterpart = isOpen ? closeRef.current : openRef.current
		void playTween(tween?.invalidate() ?? null, { counterpart })
	}, [isOpen])

	// The page stays put underneath while the sheet is over it. See Sidebar for why this is Lenis
	// and not an overflow rule on the body.
	const lenis = useLenis()
	useEffect(() => {
		if (!isOpen || !lenis) return
		lenis.stop()
		return () => lenis.start()
	}, [isOpen, lenis])

	useEffect(() => {
		if (!isOpen) return
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") close()
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [isOpen, close])

	// Past lg the sheet is display:none but would still be "open" — Lenis stopped, the menu button
	// stuck on its cross. Widening the window is taken as closing it.
	useEffect(() => {
		const query = window.matchMedia("(min-width: 1024px)")
		const onChange = (event: MediaQueryListEvent) => {
			if (event.matches) close()
		}
		query.addEventListener("change", onChange)
		return () => query.removeEventListener("change", onChange)
	}, [close])

	// Any navigation dismisses it — what it holds belongs to the page it was opened on. See Sidebar.
	useEffect(() => {
		close()
	}, [committedPathname, close])

	return (
		// Sidebar's structure: a full-screen grid holding the panel. inert and pointer-events-none
		// while shut, so the parked sheet is out of the tab order and does not catch clicks meant for
		// the page. z-8 puts it over the page and under the Jump To / Filters trigger (z-9), the
		// sidebar (z-10) and the navbar, whose cross is the way out of it.
		<div
			ref={scopeRef}
			id={MOBILE_SHEET_ID}
			inert={!isOpen}
			className={`h-screen w-full grid grid-cols-12 fixed left-0 top-0 z-8 overflow-hidden lg:hidden
				${isOpen ? "" : "pointer-events-none"}`}>
			{/* The panel does not scroll; the body inside it does. That is what lets a body pin its
			    footer: positioned against this box, which stays put, rather than against the content,
			    which moves. data-lenis-prevent so the wheel reaches that scroll while Lenis is
			    stopped — see Sidebar. */}
			<div
				ref={panelRef}
				data-lenis-prevent
				className="col-span-full relative h-screen -translate-x-full
				bg-background">
				<div ref={bodyRef} className="h-full"><Fragment key={contentKey}>{shownContent}</Fragment></div>
			</div>
		</div>
	)
}
