"use client"

import { useRef, useState, type MouseEvent } from "react"
import { useLenis } from "lenis/react"
import { useGSAP, ScrollTrigger } from "@/utils/gsap"
import NavLink from "@/components/actions/NavLink"
import type { SectionNavLink } from "@/components/actions/SectionNavWrapper"

export default function SectionNav({ links }: { links: SectionNavLink[] }) {
	const navRef = useRef<HTMLElement>(null)
	// Lit before the first scroll, so the reader is never looking at a nav with nothing
	// active while sitting at the top of the first section.
	const [activeId, setActiveId] = useState(links[0]?.id)
	// The section a click is currently travelling to. Everything passed on the way is
	// ignored until it arrives, so the highlight doesn't race through the whole nav.
	const pendingId = useRef<string | null>(null)
	const lenis = useLenis()

	// The bar is sticky, so a section scrolled to its own top would sit underneath it.
	function navHeight() {
		return navRef.current?.offsetHeight ?? 0
	}

	useGSAP(() => {
		const sections: { id: string; trigger: ScrollTrigger }[] = []

		links.forEach(({ id }) => {
			const el = document.getElementById(id)
			if (!el) return

			sections.push({
				id,
				trigger: ScrollTrigger.create({
					trigger: el,
					// Functions, not strings: they re-run on every refresh, so the line
					// follows the bar when a resize changes its height.
					start: () => `top ${navHeight() + 1}px`,
					end: () => `bottom ${navHeight() + 1}px`,
				}),
			})
		})

		// Asked of the triggers on every update rather than driven by their toggle
		// callbacks. A toggle is an edge, and an edge ignored is an edge gone for good:
		// suppressing them while a click was in flight left the highlight stuck a section
		// behind until some later, unrelated edge happened to fire. Reading the state
		// instead means the answer is recomputed from scratch every frame, so nothing the
		// nav missed can keep it out of step.
		function syncActive() {
			const hit = sections.find(section => section.trigger.isActive)
			if (!hit) return

			if (pendingId.current) {
				if (hit.id !== pendingId.current) return
				pendingId.current = null
			}

			setActiveId(hit.id)
		}

		// Lenis drives scroll from its own rAF loop; without this ScrollTrigger reads a
		// position one frame stale and the highlight lags the section it describes.
		const update = () => {
			ScrollTrigger.update()
			syncActive()
		}
		lenis?.on("scroll", update)

		// A click that lands a hair short of its own section never arrives, and a scroll
		// the reader cuts short is one Lenis never reports — it stops the animation
		// without calling onComplete. Their next input ends the click's claim either way,
		// and the sync on the following frame puts the highlight where it belongs.
		const release = () => { pendingId.current = null }
		window.addEventListener("wheel", release, { passive: true })
		window.addEventListener("pointerdown", release, { passive: true })
		window.addEventListener("keydown", release)

		// Positions measured at mount are provisional until fonts and images have landed.
		ScrollTrigger.refresh()
		syncActive()

		return () => {
			lenis?.off("scroll", update)
			window.removeEventListener("wheel", release)
			window.removeEventListener("pointerdown", release)
			window.removeEventListener("keydown", release)
		}
	}, { dependencies: [links, lenis] })

	function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
		// Let cmd/ctrl/shift-click open a new tab or window natively.
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		if (!lenis) return
		event.preventDefault()

		setActiveId(id)
		pendingId.current = id

		lenis.scrollTo(`#${id}`, { offset: -navHeight() })
	}

	// A page whose sections all went unlabelled gets no bar rather than an empty one.
	if (links.length === 0) return null

	return (
		<nav
			ref={navRef}
			className="grid-standard bg-background/50 backdrop-blur-2xl py-size-24 sticky top-0 left-0 z-10"
		>
			<div className="col-span-10 col-start-2 flex flex-row gap-size-48">
				{links.map(({ id, label }) => (
					<NavLink
						key={id}
						href={`#${id}`}
						active={id === activeId}
						onClick={event => handleClick(event, id)}
					>
						{label}
					</NavLink>
				))}
			</div>
		</nav>
	)
}
