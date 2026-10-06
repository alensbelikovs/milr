"use client"
import { useEffect, useRef } from "react"
import { usePointerOverlayStore } from "@/store/PointerOverlayStore"

const OFFSET = 16
// Long enough to cross the gap between two cards without the label blinking
const HIDE_DELAY = 120

// The pointer label; written to the DOM directly so following the pointer never re-renders
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

		const apply = (
			{ label, origin }: { label: string | null, origin: { x: number, y: number } | null }) => {
			if (label === null) {
				hideTimer = setTimeout(() => {
					span.style.opacity = "0"
					window.removeEventListener("pointermove", onMove)
					tracking = false
				}, HIDE_DELAY)
				return
			}

			clearTimeout(hideTimer)
			span.textContent = label
			if (origin) place(origin.x, origin.y)
			span.style.opacity = "1"
			if (!tracking) window.addEventListener("pointermove", onMove, { passive: true })
			tracking = true
		}

		const unsubscribe = usePointerOverlayStore.subscribe(apply)
		apply(usePointerOverlayStore.getState())

		return () => {
			unsubscribe()
			clearTimeout(hideTimer)
			window.removeEventListener("pointermove", onMove)
		}
	}, [])

	return (
		<span
			ref={spanRef}
			aria-hidden
			className="
				fixed left-0 top-0 z-20 pointer-events-none
				text-size-16 whitespace-nowrap text-white mix-blend-difference
				opacity-0 transition-opacity duration-200
			" />
	)
}
