"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// TextLineSplit's sibling for copy that should arrive as one piece: the whole block rises into
// place the first time it is scrolled to, and nothing is cut. For small text set in long columns,
// where a line-by-line entrance would be a dozen tiny movements nobody can follow.
//
// instant is the way out, the same as TextLineSplit's: it renders the text and does nothing else.
//
// timeline/position are TextLineSplit's too, and mean the same thing here: the rise is added to
// someone else's sequence at position instead of waiting on a trigger of its own, and plays when
// that sequence does. A getter, because the timeline may not exist until the moment it is asked
// for.
//
// as has to be a block-level tag. The rise is a transform, and a transform does nothing to an
// inline box — a span here would fade in place and never move, with nothing to say why. To reveal
// something inline, wrap it from outside in a block of its own.
export default function TextBlockReveal(
	{ children, className = "", as = "p", instant = false, timeline, position = 0 }:
		{
			children: ReactNode
			className?: string
			as?: keyof React.JSX.IntrinsicElements
			instant?: boolean
			timeline?: (() => gsap.core.Timeline) | null
			position?: number
		}) {
	const triggerRef = useRef<HTMLDivElement>(null)
	const blockRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		const trigger = triggerRef.current
		const block = blockRef.current
		if (instant || !trigger || !block) return

		// 64rem is Tailwind's lg, the same line TextLineSplit draws. Below it the copy is simply
		// there: nothing is moved out of place, so there is no state in which it is held off screen
		// by an animation that is not going to run.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// from, so the block is held down from the moment this runs rather than after a frame at
			// its resting place. A quarter of the viewport rather than a percentage of the block, so a
			// two-line paragraph and a ten-line one travel the same distance and arrive together.
			//
			// Worked out in pixels rather than handed over as "25vh", so nothing rests on how GSAP
			// converts a viewport unit on a transform. A function is also re-run on every refresh —
			// invalidateOnRefresh — so a window resized before the reveal fires still starts it a
			// quarter of ITS height down, not the old one's.
			const reveal = gsap.from(block, {
				y: () => window.innerHeight * 0.25,
				opacity: 0,
				duration: 1.2,
				ease: "expo.out",
				invalidateOnRefresh: true,

				// A trigger of its own only when nothing else is keeping time. Inside a timeline, it
				// is that timeline's trigger that decides when this plays.
				...(timeline ? {} : {
					scrollTrigger: {
						// The wrapper, not the block. The block is the thing being moved, so measuring it
						// would place the trigger a quarter of a screen lower than where the text belongs —
						// and later than the reader actually reaches it.
						trigger,
						start: "top bottom",
						once: true,
					},
				}),
			})

			// Made inside this context and then moved into the timeline, so reverting the context
			// still finds it — and pulls it back out of the timeline on the way.
			timeline?.().add(reveal, position)
		})

		return () => { mm.revert() }
	}, { dependencies: [instant, timeline, position], scope: triggerRef })

	// A JSX tag rather than createElement — see TextLineSplit for why the ref lint rule needs it.
	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>
		className?: string
		children?: ReactNode
	}>

	return (
		<div ref={triggerRef}>
			<Tag ref={blockRef} className={className}>{children}</Tag>
		</div>
	)
}
