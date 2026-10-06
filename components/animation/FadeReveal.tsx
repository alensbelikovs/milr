"use client"
import { useContext, useRef } from "react"
import { RevealOnMountContext } from "@/components/animation/RevealOnMountContext"
import { gsap, ScrollTrigger, useGSAP } from "@/utils/gsap"

// Fades its parent in on scroll. delay only applies from md up.
export default function FadeReveal({ delay = 0 }: { delay?: number }) {
	const anchorRef = useRef<HTMLSpanElement>(null)
	const onMount = useContext(RevealOnMountContext)

	useGSAP(() => {
		const target = anchorRef.current?.parentElement
		if (!target) return

		const mm = gsap.matchMedia()
		mm.add({ wide: "(min-width: 48rem)", narrow: "(max-width: 47.999rem)" }, context => {
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
	}, { dependencies: [delay, onMount], scope: anchorRef })

	return <span ref={anchorRef} className="hidden" />
}
