"use client"
import { useEffect } from "react"
import { useLenis } from "lenis/react"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { useTransitionStore } from "@/store/TransitionStore"

export default function Sidebar() {
	const sidebarContent = useSidebarContentStore(state => state.sidebarContent)
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const committedPathname = useTransitionStore(state => state.committedPathname)
	const isOpen = sidebarContent !== null

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

	// Following a link out of the menu dismisses the sidebar, and keyed on committedPathname rather
	// than usePathname so it goes at the moment the page under it is actually swapped — the router
	// commits while TransitionControl is still fading the curtain in over the outgoing page, and
	// closing then would pull the panel away in plain view.
	useEffect(() => {
		closeSidebar()
	}, [committedPathname, closeSidebar])

	if (!isOpen) return null

	return (
		<div className="h-screen w-full grid grid-cols-12 fixed left-0 top-0 z-10">
			{/* Sibling of the panel rather than its parent, so a click anywhere on it is a click
			    on the page behind — nothing from the panel bubbles through here to be filtered. */}
			<div
				className="absolute inset-0 bg-foreground/50"
				onClick={closeSidebar}/>
			{/* data-lenis-prevent, because a stopped Lenis still swallows the wheel: root mode binds
			    the listener to the whole document and preventDefaults everything it sees, so without
			    this the panel is reachable only by dragging its scrollbar. Lenis checks the attribute
			    on the event's composed path BEFORE it checks whether it is stopped, which is what
			    lets the wheel fall through to this element's native scroll while the page stays put. */}
			<div
				data-lenis-prevent
				className="bg-background col-span-6 col-start-7 z-5
				h-screen overflow-y-auto overscroll-contain scrollbar-background">
				{sidebarContent}
			</div>
		</div>
	)
}
