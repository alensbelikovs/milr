"use client"
import { useContext, useRef, type ReactNode } from "react"
import { RevealOnMountContext } from "@/components/animation/RevealOnMountContext"
import { gsap, ScrollTrigger, useGSAP } from "@/utils/gsap"

// Rises a whole block into place on scroll (from lg up). `as` must be a block-level tag.
export default function TextBlockReveal(
	{ children, className = "", as = "p", delay = 0 }: {
		children: ReactNode,
		className?: string,
		as?: keyof React.JSX.IntrinsicElements,
		delay?: number
	}) {
	const triggerRef = useRef<HTMLDivElement>(null)
	const blockRef = useRef<HTMLElement>(null)
	const onMount = useContext(RevealOnMountContext)

	useGSAP(() => {
		const trigger = triggerRef.current
		const block = blockRef.current
		if (!trigger || !block) return

		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const reveal = gsap.fromTo(block,
				{ y: window.innerHeight * 0.25, opacity: 0 },
				{ y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay, paused: !onMount })

			// restart(true) keeps the delay, which a trigger's own play() would skip
			if (!onMount) ScrollTrigger.create({
				trigger,
				start: "top bottom",
				once: true,
				onEnter: () => { reveal.restart(true) },
			})
		})

		return () => { mm.revert() }
	}, { dependencies: [delay, onMount], scope: triggerRef })

	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>,
		className?: string,
		children?: ReactNode
	}>

	return (
		<div ref={triggerRef}>
			<Tag ref={blockRef} className={className}>{children}</Tag>
		</div>
	)
}
