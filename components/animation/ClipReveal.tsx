"use client"
import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/utils/gsap"

// Both ends are explicit: a resting clip-path of `none` is nothing GSAP can interpolate towards.
const HIDDEN = "inset(100% 0% 0% 0%)"
const SHOWN = "inset(0% 0% 0% 0%)"

// Uncovers a block from the bottom up without moving it, on scroll (from lg up)
export default function ClipReveal(
	{ children, className = "", delay = 0 }: {
		children: ReactNode,
		className?: string,
		delay?: number
	}) {
	const blockRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const block = blockRef.current
		if (!block) return

		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const reveal = gsap.fromTo(block,
				{ clipPath: HIDDEN },
				{
					clipPath: SHOWN,
					duration: 1.2,
					ease: "expo.out",
					delay,
					paused: true,
					// Removed afterwards so the clip doesn't cut off focus outlines
					clearProps: "clipPath",
				})

			// restart(true) keeps the delay, which a trigger's own play() would skip
			ScrollTrigger.create({
				trigger: block,
				start: "top bottom",
				once: true,
				onEnter: () => { reveal.restart(true) },
			})
		})

		return () => { mm.revert() }
	}, { dependencies: [delay], scope: blockRef })

	return <div ref={blockRef} className={className}>{children}</div>
}
