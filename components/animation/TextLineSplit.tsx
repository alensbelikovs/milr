"use client"
import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/utils/gsap"

// Splits text into masked lines that rise in one by one on scroll (from lg up).
// linesClassName lands on each cut line, for anything drawn past the line box (e.g. an underline).
export default function TextLineSplit(
	{ children, className = "", linesClassName, as = "p", delay = 0, onMount = false }: {
		children: ReactNode,
		className?: string,
		linesClassName?: string,
		as?: keyof React.JSX.IntrinsicElements,
		delay?: number,
		// Skips the scroll trigger and plays right away (used inside the sidebar)
		onMount?: boolean
	}) {
	const elementRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		const element = elementRef.current
		if (!element) return
		let revealed = false

		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			let reveal: gsap.core.Tween | null = null

			const split = SplitText.create(element, {
				type: "lines",
				linesClass: linesClassName,
				mask: "lines",
				autoSplit: true,
				onSplit: self => {
					// A re-split after the reveal (resize, font load) should not replay it
					if (revealed) return
					if (onMount) revealed = true

					reveal = gsap.from(self.lines, {
						yPercent: 100,
						duration: 1.2,
						ease: "expo.out",
						stagger: 0.1,
						delay,
						paused: !onMount,
					})
					return reveal
				},
			})

			// restart(true) keeps the delay, which a trigger's own play() would skip
			if (!onMount) ScrollTrigger.create({
				trigger: element,
				start: "top bottom",
				once: true,
				onEnter: () => {
					revealed = true
					reveal?.restart(true)
				},
			})

			return () => { split.revert() }
		})

		return () => { mm.revert() }
	}, { dependencies: [linesClassName, delay, onMount], scope: elementRef })

	// A JSX tag rather than createElement, so the ref lint rule understands the ref
	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>,
		className?: string,
		children?: ReactNode
	}>

	return <Tag ref={elementRef} className={className}>{children}</Tag>
}
