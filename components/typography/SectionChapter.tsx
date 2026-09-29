"use client"

import { useRef, type MouseEvent } from "react"
import { useLenis } from "lenis/react"

// Sticky stacking: each chapter parks 6px below the previous one.
// Row height is deterministic because text-size-16 carries line-height 1,
// so the stuck row is exactly var(--text-size-16) tall.
const STACK_GAP = 0
const FONT_HEIGHT = 10

export default function SectionChapter(
	{ name, index, className = "" }:
		{ name: string; index: number; className?: string }
) {
	const ref = useRef<HTMLDivElement>(null)
	const lenis = useLenis()

	const id = `chapter-${index}`
	const top = `calc(var(--spacing-size-16) + ${index - 1} * (var(--text-size-16) + ${STACK_GAP}px + ${FONT_HEIGHT}px))`

	function handleClick(event: MouseEvent<HTMLAnchorElement>) {
		const el = ref.current
		if (!el || !lenis) return
		// Let cmd/ctrl/shift-click open a new tab or window natively.
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		event.preventDefault()

		// A stuck element reports its pinned rect, not its place in the flow.
		// Read the resolved top first, then drop out of sticky for one
		// synchronous measure — no paint happens in between, so nothing flashes.
		const stickyTop = parseFloat(getComputedStyle(el).top) || 0
		el.style.position = "static"
		const flowTop = el.getBoundingClientRect().top + lenis.actualScroll
		el.style.position = ""

		// At this scroll the chapter sits exactly where it was the instant
		// before it stuck.
		lenis.scrollTo(flowTop - stickyTop)
	}

	return (
		<div
			ref={ref}
			id={id}
			style={{ top, scrollMarginTop: top }}
			className={`grid-standard sticky z-2 ${className}`}
		>
			<div className="col-start-7 col-span-5">
				<div className="flex gap-size-16 text-size-16 items-end">
					<p className="font-serif opacity-50">Chapter { index }</p>
					<a
						href={`#${id}`}
						onClick={handleClick}
						style={{ lineHeight: 0.9 }}
						className="hover:underline cursor-pointer">
						{name}
					</a>
				</div>
			</div>
		</div>
	)
}
