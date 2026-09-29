"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// TextLineSplit's reveal without the cutting: the whole thing rises out of a mask of its own, as
// one piece. For text that is a single line by design — a link, a label — where splitting would
// buy nothing but the work of re-cutting on every resize.
//
// The same API as TextLineSplit, so the two are interchangeable where the difference does not
// matter: instant renders it plainly, and timeline/position hand the reveal to someone else's
// sequence instead of a trigger of its own.
//
// Because nothing is cut, the element that moves exists from the first render and never changes —
// which is what lets an owner that plays and replays a sequence rely on it being there.
export default function TextMaskReveal(
	{ children, className = "", as = "span", instant = false, timeline, position = 0 }:
		{
			children: ReactNode
			className?: string
			as?: keyof React.JSX.IntrinsicElements
			instant?: boolean
			timeline?: (() => gsap.core.Timeline) | null
			position?: number
		}) {
	const maskRef = useRef<HTMLElement>(null)
	const riseRef = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		const mask = maskRef.current
		const rise = riseRef.current
		if (instant || !mask || !rise) return

		// 64rem is Tailwind's lg, the line TextLineSplit draws. Below it the text is simply there.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// fromTo rather than from: a timeline that is replayed — a sidebar opened a second time —
			// restarts this, and with both ends written down it rises from the bottom of its mask
			// every time, whatever state the last run left it in.
			const reveal = gsap.fromTo(rise,
				{ yPercent: 100 },
				{
					yPercent: 0,
					duration: 1.2,
					ease: "expo.out",
					...(timeline ? {} : {
						scrollTrigger: {
							trigger: mask,
							start: "top bottom",
							once: true,
						},
					}),
				})

			timeline?.().add(reveal, position)
		})

		return () => { mm.revert() }
	}, { dependencies: [instant, timeline, position], scope: maskRef })

	// A JSX tag rather than createElement — see TextLineSplit for why the ref lint rule needs it.
	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>
		className?: string
		children?: ReactNode
	}>

	// Both levels block: the mask so it has a box to clip to, the inner one because a transform does
	// nothing to an inline box. The mask is sized by what is inside it, so it clips exactly the
	// travel and nothing else.
	return (
		<Tag ref={maskRef} className={`block overflow-hidden ${className}`}>
			<span ref={riseRef} className="block">{children}</span>
		</Tag>
	)
}
