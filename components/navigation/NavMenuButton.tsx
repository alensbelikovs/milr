"use client"
import { useEffect, useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// Timing for both halves of the swap: the lines going out and the cross coming in. inOut rather
// than an out ease, because the one timeline runs backwards to close — an out ease reversed is an in
// ease, and the close would feel like a different animation from the open.
const SWAP = { duration: 0.35, ease: "expo.inOut" }

// Two lines when the sidebar is shut, a cross when it is open. Reads the store for both what it
// shows and what it does, so the navbar only has to place it.
//
// The cross is its own pair of lines rather than the menu lines turned on their sides. Those two
// differ in width and anchoring, and the bottom one widens on hover through a CSS width transition
// — re-laying them out into a cross would mean GSAP writing width and position inline, which fights
// that transition on the way in and strands inline values over the classes on the way back. Kept
// apart, GSAP only ever touches transforms, and each pair keeps the layout its classes give it.
export default function NavMenuButton() {
	const toggleNav = useSidebarContentStore(state => state.toggleNav)
	const isOpen = useSidebarContentStore(state => state.sidebarContent !== null)

	const buttonRef = useRef<HTMLButtonElement>(null)
	const timelineRef = useRef<gsap.core.Timeline | null>(null)

	// Built once, played forwards to open and backwards to close. One timeline rather than a tween
	// per toggle, so a second press mid-swap turns the animation around from wherever it has got to
	// instead of starting a new one over the top of it.
	useGSAP(() => {
		const button = buttonRef.current
		if (!button) return

		const lines = button.querySelectorAll("[data-menu-line]")
		const [crossA, crossB] = button.querySelectorAll("[data-cross-line]")

		// The menu lines shrink toward the right edge they share. The cross lines grow out of the
		// point where they meet, so their origin is their own middle — which is also what makes the
		// ±45 turn a cross rather than two lines swinging off an end.
		gsap.set(lines, { transformOrigin: "100% 50%" })
		gsap.set(crossA, { transformOrigin: "50% 50%", rotation: 45, scaleX: 0, opacity: 1 })
		gsap.set(crossB, { transformOrigin: "50% 50%", rotation: -45, scaleX: 0, opacity: 1 })

		timelineRef.current = gsap.timeline({ paused: true, defaults: SWAP })
			.to(lines, { scaleX: 0 })
			.to([crossA, crossB], { scaleX: 0.8 })
	}, { scope: buttonRef })

	useEffect(() => {
		const timeline = timelineRef.current
		if (!timeline) return
		if (isOpen) timeline.play()
		else timeline.reverse()
	}, [isOpen])

	return (
		<button
			ref={buttonRef}
			type="button"
			onClick={toggleNav}
			// The lines are all there is to see, so the name has to come from here — and it says
			// which way a press goes, since the same button both opens and closes.
			aria-label={isOpen ? "Close menu" : "Open menu"}
			aria-expanded={isOpen}
			className="group cursor-pointer
			pointer-events-auto absolute top-0
			right-size-24 h-size-64 aspect-16/10">
			<div className="relative h-6 w-full">
				<div data-menu-line className="h-0.5 w-8 bg-background absolute right-0 top-1.5"></div>
				<div
					data-menu-line
					className={`h-0.5 w-4 transition-[width] duration-200 ease-in-out
						${isOpen ? "" : "group-hover:w-8"}
						bg-background absolute right-0 bottom-2`}></div>
				<div data-cross-line className="h-0.5 w-8 -mt-px bg-background absolute -right-1 top-1/2 opacity-0"></div>
				<div data-cross-line className="h-0.5 w-8 -mt-px bg-background absolute -right-1 top-1/2 opacity-0"></div>
			</div>
		</button>
	)
}
