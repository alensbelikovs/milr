"use client"

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import { useLenis } from "lenis/react"
import { useGSAP, ScrollTrigger } from "@/utils/gsap"
import NavLink from "@/components/navigation/NavLink"
import type { SectionNavLink } from "@/components/navigation/SectionNavWrapper"

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

	// Left/right walk focus along the bar. The links keep their place in the tab order — this is
	// a nav, not a toolbar — so this is a shortcut on top of Tab rather than a replacement for it.
	//
	// Enter needs nothing here: focus lands on a real <a href>, so the browser raises a click of
	// its own and handleClick answers it exactly as it would a pointer. Handling the key as well
	// would run the same scroll twice.
	function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
		// Alt+Left is the browser's back, and the other modifiers carry their own meanings.
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

		const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
		if (step === 0) return

		// Read from the DOM rather than kept in a ref array: the nav holds nothing but these
		// anchors, so the query is the list, already in rendered order.
		const anchors = Array.from(navRef.current?.querySelectorAll("a") ?? [])
		const at = anchors.indexOf(document.activeElement as HTMLAnchorElement)

		// Focus is inside the bar but not on a link — leave the key to whatever holds it.
		if (at === -1) return

		// Only once a move is certain, so an arrow pressed anywhere else still scrolls the page.
		event.preventDefault()

		// Wraps, so holding one direction never dead-ends.
		anchors[(at + step + anchors.length) % anchors.length].focus()
	}

	// A page whose sections all went unlabelled gets no bar rather than an empty one.
	if (links.length === 0) return null

	return (
		// /80, not /50. The navbar above draws its menu lines with mix-blend-difference, and
		// difference has one blind spot: a backdrop at half grey. Over a dark section a bar at /50
		// comes out at almost exactly that, and |line − backdrop| lands on the backdrop's own colour
		// — the lines are drawn but invisible. Contrast against black runs as |1 − 2 × opacity|, so it
		// is zero at /50 and back to healthy by /80, which still frosts the section beneath.
		<nav
			ref={navRef}
			onKeyDown={handleKeyDown}
			className="hidden lg:grid grid-cols-12 gap-size-24 px-size-24 bg-background/80 backdrop-blur-2xl py-size-24 sticky top-0 left-0 z-10"
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
