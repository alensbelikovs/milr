"use client"
import { Fragment, useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { useSite } from "@/components/layout/SiteProvider"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { useTransitionStore } from "@/store/TransitionStore"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"

// Two timelines rather than one reversed, so both directions ease out
const SLIDE = { duration: 1, ease: "expo.out" }

export const SIDEBAR_ID = "sidebar"

export default function Sidebar() {
	const sidebarContent = useSidebarContentStore(state => state.sidebarContent)
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const committedPathname = useTransitionStore(state => state.committedPathname)
	const lenis = useLenis()
	const { dict } = useSite()
	const isOpen = sidebarContent !== null

	// Keeps the last content on screen while the panel slides out; the key remounts every new content
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

	useGSAP(() => {
		const panel = panelRef.current
		const backdrop = backdropRef.current
		const body = bodyRef.current
		if (!panel || !backdrop || !body) return

		// x is zeroed so GSAP doesn't fold the translate-x-full class in as fixed pixels
		gsap.set(panel, { x: 0, xPercent: 100 })
		gsap.set(backdrop, { autoAlpha: 0 })

		openRef.current = gsap.timeline({ paused: true, defaults: SLIDE })
			.set(body, { opacity: 1 }, 0)
			.to(panel, { xPercent: 0 }, 0)
			.to(backdrop, { autoAlpha: 1 }, 0)

		closeRef.current = gsap.timeline({ paused: true, defaults: SLIDE })
			.to(panel, { xPercent: 100 }, 0)
			.to(backdrop, { autoAlpha: 0 }, 0)
			.to(body, { opacity: 0, duration: SLIDE.duration / 2 }, 0)
	}, { scope: scopeRef })

	// Invalidated first, so either timeline starts from wherever the other left the panel
	useEffect(() => {
		const tween = isOpen ? openRef.current : closeRef.current
		const counterpart = isOpen ? closeRef.current : openRef.current
		void playTween(tween?.invalidate() ?? null, { counterpart })
	}, [isOpen])

	// Focus moves into the panel on open and back to whatever opened it on close
	useEffect(() => {
		if (!isOpen) return
		const opener = document.activeElement as HTMLElement | null
		panelRef.current?.focus({ preventScroll: true })
		return () => opener?.focus({ preventScroll: true })
	}, [isOpen])

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

	// Any navigation closes the sidebar, once the new page is on screen
	useEffect(() => {
		closeSidebar()
	}, [committedPathname, closeSidebar])

	return (
		<div
			ref={scopeRef}
			id={SIDEBAR_ID}
			inert={!isOpen}
			className={`
				h-screen w-full grid grid-cols-12
				fixed left-0 top-0 z-10 overflow-hidden
				${isOpen ? "" : "pointer-events-none"}
			`}>
			<div
				ref={backdropRef}
				aria-hidden
				className="absolute inset-0 bg-foreground/50 opacity-0 invisible"
				onClick={closeSidebar} />
			{/* data-lenis-prevent lets the wheel scroll the panel while Lenis is stopped */}
			<div
				ref={panelRef}
				role="dialog"
				aria-modal
				aria-label={dict.common.panel}
				tabIndex={-1}
				data-lenis-prevent
				className="
					col-span-full md:col-span-6 md:col-start-7
					h-screen bg-background z-5 translate-x-full outline-none
					overflow-y-auto overscroll-contain scrollbar-background
				">
				<div ref={bodyRef} className="h-full">
					<Fragment key={contentKey}>{shownContent}</Fragment>
				</div>
			</div>
		</div>
	)
}
