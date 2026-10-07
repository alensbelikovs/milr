"use client"
import { useEffect, useRef } from "react"
import { useSite } from "@/components/layout/SiteProvider"
import { usePointerOverlayStore } from "@/store/PointerOverlayStore"

// Makes the parent show a pointer label on hover ("View" by default); a click swaps it to toggledLabel and back
export default function PointerOverlayTrigger(
	{ label: labelProp, toggledLabel }: { label?: string, toggledLabel?: string }) {
	const { dict } = useSite()
	const label = labelProp ?? dict.common.view
	const anchorRef = useRef<HTMLSpanElement>(null)
	const toggledRef = useRef(false)
	const showOverlay = usePointerOverlayStore(state => state.showOverlay)
	const hideOverlay = usePointerOverlayStore(state => state.hideOverlay)

	useEffect(() => {
		const surface = anchorRef.current?.parentElement
		if (!surface) return

		const wide = window.matchMedia("(min-width: 64rem)")
		const show = (event: MouseEvent) => {
			if (!wide.matches) return
			showOverlay(
				toggledLabel && toggledRef.current ? toggledLabel : label,
				{ x: event.clientX, y: event.clientY })
		}
		const onClick = (event: MouseEvent) => {
			if ((event.target as Element | null)?.closest("button, a")) return
			toggledRef.current = !toggledRef.current
			show(event)
		}

		surface.addEventListener("pointerenter", show)
		surface.addEventListener("pointerleave", hideOverlay)
		if (toggledLabel) surface.addEventListener("click", onClick)

		return () => {
			surface.removeEventListener("pointerenter", show)
			surface.removeEventListener("pointerleave", hideOverlay)
			surface.removeEventListener("click", onClick)
			hideOverlay()
		}
	}, [label, toggledLabel, showOverlay, hideOverlay])

	return <span ref={anchorRef} className="hidden" />
}
