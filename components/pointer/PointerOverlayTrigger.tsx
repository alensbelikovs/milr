"use client"
import { useEffect, useRef } from "react"
import { usePointerOverlayStore } from "@/store/PointerOverlayStore"

// Marks the box it is dropped into as one that wants a pointer label, and says what it should read.
// Draws nothing itself — PointerOverlay in the layout does the drawing.
//
// It listens on its PARENT, which is the contract: drop it inside the element whose pointer you want
// followed. That is also what lets a server component opt in — the boundary is this file, not the
// card, and nothing needs to be handed a handler.
//
// toggledLabel is for a box whose click does two things in turn: the label alternates between the
// two on every click inside the surface, so it names the action that is available NEXT rather than
// the one just taken. Left out, the box has one label and the click listener is never bound.
export default function PointerOverlayTrigger(
	{ label = "View", toggledLabel }:
		{ label?: string; toggledLabel?: string }) {
	const anchorRef = useRef<HTMLSpanElement>(null)
	const showOverlay = usePointerOverlayStore(state => state.showOverlay)
	const hideOverlay = usePointerOverlayStore(state => state.hideOverlay)

	// A ref, not state: which of the two labels is up changes nothing this component renders — the
	// word lives in the store and on a node in the layout — so a re-render would only cost the
	// listeners below a rebind.
	const toggledRef = useRef(false)

	useEffect(() => {
		const surface = anchorRef.current?.parentElement
		if (!surface) return

		// 64rem is Tailwind's lg. Below it there is no pointer to follow — a touch screen has no
		// hover, and pointerenter fires on a tap, so without this the label would appear beside a
		// finger and stay there. Read per event rather than at bind time, so a window dragged across
		// the breakpoint is right without a remount.
		const wide = window.matchMedia("(min-width: 64rem)")

		const currentLabel = () => toggledLabel && toggledRef.current ? toggledLabel : label

		const onEnter = (event: PointerEvent) => {
			if (!wide.matches) return
			showOverlay(currentLabel(), { x: event.clientX, y: event.clientY })
		}
		const onLeave = () => hideOverlay()

		// Pushed straight back to the store with the click's own coordinates: the pointer is still
		// over the surface, so the word has to change under it rather than on the next move.
		//
		// A click on a control inside the surface belongs to that control, not to the surface — a
		// "Read more" pressed on the band should not flip the band's label as well.
		const onClick = (event: MouseEvent) => {
			if (!wide.matches) return
			if ((event.target as Element | null)?.closest("button, a")) return
			toggledRef.current = !toggledRef.current
			showOverlay(currentLabel(), { x: event.clientX, y: event.clientY })
		}

		surface.addEventListener("pointerenter", onEnter)
		surface.addEventListener("pointerleave", onLeave)
		if (toggledLabel) surface.addEventListener("click", onClick)

		return () => {
			surface.removeEventListener("pointerenter", onEnter)
			surface.removeEventListener("pointerleave", onLeave)
			surface.removeEventListener("click", onClick)

			// Unmounting while hovered — a card that pages away under the pointer, or a whole route
			// leaving — would otherwise strand the label on screen over something that is gone.
			hideOverlay()
		}
	}, [label, toggledLabel, showOverlay, hideOverlay])

	// display:none, so it takes no space and no cell in whatever grid it lands in. It exists only to
	// hand the effect above a parent to listen on.
	return <span ref={anchorRef} className="hidden" />
}
