"use client"
import { useEffect, useRef } from "react"
import { usePointerOverlayStore } from "@/store/PointerOverlayStore"

// Clear of the pointer itself, so the word is not sitting under the cursor drawing it.
const OFFSET = 16

// Long enough to cross a gap between two cards, short enough that leaving for good still reads as
// leaving. This is what keeps the label from blinking as the pointer crosses a grid — the second
// card's enter arrives before the first card's leave has taken effect.
const HIDE_DELAY = 120

// The one label in the document, mounted in the layout and told what to say by whatever the pointer
// is over.
//
// Subscribed to the store by hand rather than through the hook, and the span is written to directly:
// this component renders once and never again. Text, position and opacity are all style and node
// writes, which is what a thing that moves at pointer rate should be — a render per pointermove is
// a render per frame, for one element that React is not laying out anyway.
//
// Hovering is also what starts it tracking. The move listener is bound only while something is
// asking for a label, so a page with nothing hovered does no pointer work at all.
export default function PointerOverlay() {
	const spanRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const span = spanRef.current
		if (!span) return

		let hideTimer: ReturnType<typeof setTimeout> | undefined
		let tracking = false

		const place = (x: number, y: number) => {
			span.style.transform = `translate3d(${x + OFFSET}px, ${y + OFFSET}px, 0)`
		}
		const onMove = (event: PointerEvent) => place(event.clientX, event.clientY)

		const track = () => {
			if (tracking) return
			// passive, because this only reads the event — saying so up front keeps it off the path
			// that can hold up a scroll.
			window.addEventListener("pointermove", onMove, { passive: true })
			tracking = true
		}
		const untrack = () => {
			if (!tracking) return
			window.removeEventListener("pointermove", onMove)
			tracking = false
		}

		const apply = ({ label, origin }: { label: string | null, origin: { x: number, y: number } | null }) => {
			if (label !== null) {
				// Cancels a hide that has not fired yet, which is the whole point of the delay: the
				// next card claims the label before the last one's leave can put it away.
				clearTimeout(hideTimer)

				span.textContent = label

				// The enter event's own coordinates, so the word is in the right place on the frame it
				// appears rather than waiting for a move that may never come.
				if (origin) place(origin.x, origin.y)

				span.style.opacity = "1"
				track()
				return
			}

			hideTimer = setTimeout(() => {
				span.style.opacity = "0"

				// Only once it is actually gone. Tracking through the delay is what lets it follow the
				// pointer across the gap between two cards.
				untrack()
			}, HIDE_DELAY)
		}

		const unsubscribe = usePointerOverlayStore.subscribe(apply)

		// The store may already be showing something — a card hovered while the page it lives on was
		// still arriving, which the layout outlives.
		apply(usePointerOverlayStore.getState())

		return () => {
			unsubscribe()
			clearTimeout(hideTimer)
			untrack()
		}
	}, [])

	return (
		<span
			ref={spanRef}
			// The word is a second name for something already named underneath it, so it is furniture
			// to a screen reader rather than content.
			aria-hidden
			// mix-blend-difference against white, which is what makes one colour legible over both a
			// dark band and a light page: over black it stays white, over the near-white background
			// it comes out as its inverse. A fixed colour would disappear into one or the other.
			className="fixed left-0 top-0 z-20 pointer-events-none
				text-size-16 whitespace-nowrap text-white mix-blend-difference
				opacity-0 transition-opacity duration-200" />
	)
}
