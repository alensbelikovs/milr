"use client"
import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/utils/gsap"

// Fades its parent in on scroll. delay only applies from md up; wideOnly skips the fade below md.
// onMount skips the scroll trigger and plays right away (used inside the sidebar).
export default function FadeReveal(
	{ delay = 0, onMount = false, wideOnly = false }: { delay?: number, onMount?: boolean, wideOnly?: boolean }) {
	const anchorRef = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		const target = anchorRef.current?.parentElement
		if (!target) return

		const mm = gsap.matchMedia()
		mm.add({ wide: "(min-width: 48rem)", narrow: "(max-width: 47.999rem)" }, context => {
			if (wideOnly && !context.conditions?.wide) return

			const reveal = gsap.fromTo(target,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 1.2,
					ease: "expo.out",
					delay: context.conditions?.wide ? delay : 0,
					paused: !onMount,
				})

			// restart(true) keeps the delay, which a trigger's own play() would skip
			if (!onMount) ScrollTrigger.create({
				trigger: target,
				start: "top bottom",
				once: true,
				onEnter: () => { reveal.restart(true) },
			})
		})

		return () => { mm.revert() }
	}, { dependencies: [delay, onMount, wideOnly], scope: anchorRef })

	return <span ref={anchorRef} className="hidden" />
}
