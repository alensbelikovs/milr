"use client"
import { useEffect, useRef } from "react"
import { useSite } from "@/components/layout/SiteProvider"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { gsap, useGSAP } from "@/utils/gsap"

// inOut, because the same timeline plays in reverse to close
const SWAP = { duration: 0.35, ease: "expo.inOut" }

// Two lines when the sidebar is closed, a cross while it is open
export default function NavMenuButton() {
	const { dict } = useSite()
	const toggleNav = useSidebarContentStore(state => state.toggleNav)
	const isOpen = useSidebarContentStore(state => state.sidebarContent !== null)

	const buttonRef = useRef<HTMLButtonElement>(null)
	const timelineRef = useRef<gsap.core.Timeline | null>(null)

	// The cross is a separate pair of lines, so GSAP only ever touches transforms
	useGSAP(() => {
		const button = buttonRef.current
		if (!button) return

		const lines = button.querySelectorAll("[data-menu-line]")
		const [crossA, crossB] = button.querySelectorAll("[data-cross-line]")

		gsap.set(lines, { transformOrigin: "100% 50%" })
		gsap.set(crossA, { transformOrigin: "50% 50%", rotation: 45, scaleX: 0, opacity: 1 })
		gsap.set(crossB, { transformOrigin: "50% 50%", rotation: -45, scaleX: 0, opacity: 1 })

		timelineRef.current = gsap.timeline({ paused: true, defaults: SWAP })
			.to(lines, { scaleX: 0 })
			.to([crossA, crossB], { scaleX: 0.8 })
	}, { scope: buttonRef })

	useEffect(() => {
		if (isOpen) timelineRef.current?.play()
		else timelineRef.current?.reverse()
	}, [isOpen])

	return (
		<button
			ref={buttonRef}
			type="button"
			onClick={toggleNav}
			aria-label={isOpen ? dict.common.closeMenu : dict.common.openMenu}
			aria-expanded={isOpen}
			className="
				group absolute top-0 right-size-24 h-size-64 aspect-16/10
				cursor-pointer pointer-events-auto
			">
			<div className="relative h-6 w-full">
				<div data-menu-line className="absolute right-0 top-1.5 h-0.5 w-8 bg-background" />
				<div
					data-menu-line
					className={`
						absolute right-0 bottom-2 h-0.5 w-4 bg-background
						transition-[width] duration-200 ease-in-out
						${isOpen ? "" : "group-hover:w-8"}
					`} />
				{[0, 1].map(line => (
					<div
						key={line}
						data-cross-line
						className="absolute -right-1 top-1/2 h-0.5 w-8 -mt-px bg-background opacity-0" />
				))}
			</div>
		</button>
	)
}
