"use client"
import { useContext, useRef, type ReactNode } from "react"
import { RevealOnMountContext } from "@/components/animation/RevealOnMountContext"
import { gsap, ScrollTrigger, useGSAP } from "@/utils/gsap"

// Rises single-line text out of its own mask as one piece, on scroll (from lg up)
export default function TextMaskReveal(
	{ children, className = "", as = "span", delay = 0 }: {
		children: ReactNode,
		className?: string,
		as?: keyof React.JSX.IntrinsicElements,
		delay?: number
	}) {
	const maskRef = useRef<HTMLElement>(null)
	const riseRef = useRef<HTMLSpanElement>(null)
	const onMount = useContext(RevealOnMountContext)

	useGSAP(() => {
		const mask = maskRef.current
		const rise = riseRef.current
		if (!mask || !rise) return

		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const reveal = gsap.fromTo(rise,
				{ yPercent: 100 },
				{ yPercent: 0, duration: 1.2, ease: "expo.out", delay, paused: !onMount })

			// restart(true) keeps the delay, which a trigger's own play() would skip
			if (!onMount) ScrollTrigger.create({
				trigger: mask,
				start: "top bottom",
				once: true,
				onEnter: () => { reveal.restart(true) },
			})
		})

		return () => { mm.revert() }
	}, { dependencies: [delay, onMount], scope: maskRef })

	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>,
		className?: string,
		children?: ReactNode
	}>

	return (
		<Tag ref={maskRef} className={`block overflow-hidden ${className}`}>
			<span ref={riseRef} className="block">{children}</span>
		</Tag>
	)
}
