"use client"

import { useRef } from "react"
import type { ReactNode } from "react"
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/utils/gsap"

type TextLineSplitProps = {
	as?: keyof React.JSX.IntrinsicElements
	children: ReactNode
	className?: string
}

// How long the window has to stay still before the resize counts as finished.
const RESIZE_END_DELAY = 200

export default function TextLineSplit({
	as = "p",
	children,
	className,
}: TextLineSplitProps) {
	const elementRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		let maskSplit: SplitText | null = null
		let revealSplit: SplitText | null = null
		let revealTween: gsap.core.Tween | null = null
		let scrollTrigger: ScrollTrigger | null = null
		let hasRevealed = false

		const split = () => {
			// Outer split wraps each line in an overflow-hidden mask; the inner split
			// re-wraps the same text so its lines can translate inside that mask.
			maskSplit = SplitText.create(elementRef.current, { type: 'lines', linesClass: 'overflow-hidden' })
			revealSplit = SplitText.create(maskSplit.lines, { type: 'lines' })

			// Already revealed, so the fresh lines just stay where they land.
			if (hasRevealed) return

			revealTween = gsap.fromTo(revealSplit.lines,
				{ yPercent: 100, scale: 0.9 },
				{ yPercent: 0, scale: 1, duration: 1.5, ease: "expo.out", paused: true, stagger: 0.1 }
			)

			scrollTrigger = ScrollTrigger.create({
				trigger: elementRef.current,
				start: "top bottom",
				once: true,
				onEnter: () => {
					hasRevealed = true
					revealTween?.play()
				},
			})
		}

		const unsplit = () => {
			scrollTrigger?.kill()
			revealTween?.kill()
			// Inner split first: reverting the outer one restores the original markup.
			revealSplit?.revert()
			maskSplit?.revert()
			scrollTrigger = null
			revealTween = null
			revealSplit = null
			maskSplit = null
		}

		split()

		let resizeEndTimeout = 0
		// Only width affects where lines break, and mobile browsers fire resize on
		// every URL-bar show/hide, so height-only changes are ignored.
		let lastWidth = window.innerWidth

		const onResize = () => {
			clearTimeout(resizeEndTimeout)
			resizeEndTimeout = window.setTimeout(() => {
				if (window.innerWidth === lastWidth) return
				lastWidth = window.innerWidth

				unsplit()
				split()
				ScrollTrigger.refresh()
			}, RESIZE_END_DELAY)
		}

		window.addEventListener("resize", onResize)

		return () => {
			window.removeEventListener("resize", onResize)
			clearTimeout(resizeEndTimeout)
			unsplit()
		}
	}, { scope: elementRef })

	// A JSX tag rather than createElement, because the ref lint rule cannot see that createElement
	// does not read a ref it is handed: to it, any function taking a ref might read .current during
	// render. As a JSX attribute the ref is understood for what it is, and React assigns it after
	// mount as always. The cast is what lets one ref type serve every tag `as` allows.
	const Tag = as as unknown as React.FC<{ ref?: React.Ref<HTMLElement>, className?: string, children?: ReactNode }>

	return <Tag ref={elementRef} className={className}>{children}</Tag>
}
