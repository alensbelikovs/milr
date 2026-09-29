"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, SplitText } from "@/utils/gsap"

// Text that rises into place a line at a time when it is first scrolled to. The wrapper owns the
// cutting and the animation both; what it is given is ordinary markup, and what it leaves behind
// when it goes is the same ordinary markup.
//
// instant is the way out: it renders the text and does nothing else. For copy that is already on
// screen when the page arrives, or anywhere the reveal would be in the way rather than worth
// waiting for.
//
// linesClassName lands on each line SplitText cuts, which is the box its mask is sized to. It is
// for anything drawn outside the text's own line box that the mask would otherwise clip — an
// underline pushed below the baseline, in a face set solid, falls past the bottom of the line.
//
// timeline hands the reveal to someone else's sequence: the lines are added to it at position
// instead of waiting on a trigger of their own, and play when it does. For text that is one part of
// a larger entrance — a row in a list that arrives as a cascade. A getter, because the timeline may
// not exist until the moment it is asked for.
export default function TextLineSplit(
	{ children, className = "", linesClassName, as = "p", instant = false, timeline, position = 0 }:
		{
			children: ReactNode
			className?: string
			linesClassName?: string
			as?: keyof React.JSX.IntrinsicElements
			instant?: boolean
			timeline?: (() => gsap.core.Timeline) | null
			position?: number
		}) {
	const elementRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		if (instant || !elementRef.current) return

		// Whether the reader has already watched this arrive. A re-cut after that point is a
		// measurement, not an entrance. Outside the query below, so crossing the breakpoint twice
		// does not play the entrance a second time.
		let revealed = false

		// 64rem is Tailwind's lg. Below it the copy is simply there: the split never happens, so
		// there is no state in which a line is being held out of sight by an animation that is not
		// going to run. The whole reveal is inside the query rather than guarded by it, which is what
		// makes crossing down out of lg put the original markup back.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const split = SplitText.create(elementRef.current, {
				type: "lines",
				linesClass: linesClassName,

				// Each line gets an overflow-hidden wrapper of its own, so a line rising into place is
				// clipped by its own box — nothing the caller has to provide, and nothing that can
				// clip the wrong thing when the copy changes length.
				mask: "lines",

				// The lines are re-cut whenever the element's width changes or a webfont finishes
				// loading. Where a line breaks is a function of both, so a split made at the old width
				// in the fallback face is wrong on two counts — and the masks would be wrong with it,
				// since they are sized to lines that no longer exist.
				autoSplit: true,

				onSplit: self => {
					// Re-cut after the reveal has already run: the fresh lines belong where they fall.
					// Playing them in again would animate text the reader has been looking at. With a
					// timeline, it is the timeline that knows — once its playhead has moved, it has.
					if (revealed || (timeline && timeline().progress() > 0)) return

					// from, not fromTo, so the lines are held down from the moment they are cut rather
					// than after a frame spent at their resting place.
					const reveal = gsap.from(self.lines, {
						yPercent: 100,
						duration: 1.2,
						ease: "expo.out",
						stagger: 0.1,

						// A trigger of its own only when nothing else is keeping time. Inside a
						// timeline, that timeline's trigger decides when this plays.
						...(timeline ? {} : {
							scrollTrigger: {
								trigger: elementRef.current,
								start: "top bottom",
								once: true,
								onEnter: () => { revealed = true },
							},
						}),
					})

					// Built here, in onSplit, rather than by whoever owns the timeline: a re-cut — a
					// webfont arriving before the list is reached — replaces every line, and a tween
					// built from outside would be left pointing at lines that are gone. Returned
					// either way, so GSAP pulls the old one out of the timeline when the next cut
					// lands.
					timeline?.().add(reveal, position)
					return reveal
				},
			})

			// Runs when the screen drops below lg as well as on unmount, and puts the original markup
			// back: the line wrappers and the masks are ours, not the document's. GSAP takes the
			// animation returned above down with them. Reverted by hand because a split is not an
			// animation — matchMedia would not know to undo it.
			return () => { split.revert() }
		})

		return () => { mm.revert() }
	}, { dependencies: [instant, linesClassName, timeline, position], scope: elementRef })

	// A JSX tag rather than createElement, because the ref lint rule cannot see that createElement
	// does not read a ref it is handed: to it, any function taking a ref might read .current during
	// render. As a JSX attribute the ref is understood for what it is, and React assigns it after
	// mount as always. The cast is what lets one ref type serve every tag `as` allows.
	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>
		className?: string
		children?: ReactNode
	}>

	return <Tag ref={elementRef} className={className}>{children}</Tag>
}
