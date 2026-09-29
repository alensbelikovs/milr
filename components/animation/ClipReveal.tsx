"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// Clipped away entirely at rest — the top edge of the clip rectangle pushed all the way down to the
// bottom — and opened from there by drawing that edge back up. So the block is uncovered from its
// bottom upward rather than sliding in from anywhere. The same pair ServicesList clips its pictures
// with, kept in the same shape so the two read as one idea.
//
// Both ends are written out because neither can be read off the element. A block's resting
// clip-path is `none`, which is not a rectangle GSAP could interpolate towards, and a computed
// inset is shortened by the browser to fewer values than the from state has — so a `from` tween, or
// a `fromTo` that leaves the end implied, has nothing to land on.
const HIDDEN = "inset(100% 0% 0% 0%)"
const SHOWN = "inset(0% 0% 0% 0%)"

// The same travel time and curve every other reveal on the site uses, so a block that opens this way
// still arrives on the beat of the copy around it.
const REVEAL = { duration: 1.2, ease: "expo.out" }

// TextBlockReveal's sibling for a block that should be uncovered rather than moved: nothing travels,
// the block simply stops being clipped. For something whose shape is the point — a filled button, a
// picture — where a rise of a quarter of the screen is a bigger movement than the element deserves
// and leaves it drifting under whatever sits below it on the way in.
//
// The same API as the rest of the family, so the two are interchangeable where the difference does
// not matter: instant renders it plainly, and timeline/position hand the reveal to someone else's
// sequence instead of a trigger of its own. A getter, because that timeline may not exist until the
// moment it is asked for.
//
// One element, where TextBlockReveal needs two. Its rise moves the block, so measuring the block
// would put the trigger a quarter of a screen below where the content belongs and it needs a
// wrapper that stays put to measure instead. A clip changes nothing about layout — the block keeps
// its box whether it is drawn or not — so here the block is its own trigger.
export default function ClipReveal(
	{ children, className = "", as = "div", instant = false, timeline, position = 0 }:
		{
			children: ReactNode
			className?: string
			as?: keyof React.JSX.IntrinsicElements
			instant?: boolean
			timeline?: (() => gsap.core.Timeline) | null
			position?: number
		}) {
	const blockRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		const block = blockRef.current
		if (instant || !block) return

		// 64rem is Tailwind's lg, the same line every reveal on the site draws. Below it the block is
		// simply there: no clip is ever set, so there is no state in which it is held out of sight by
		// an animation that is not going to run.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const reveal = gsap.fromTo(block,
				{ clipPath: HIDDEN },
				{
					clipPath: SHOWN,
					...REVEAL,

					// The clip comes off the element entirely once it has finished, rather than being
					// left at inset(0%). That rests flush with the border box, which is exactly where a
					// focus ring is drawn — so leaving it on would clip the outline off a link the
					// moment anyone reached it by keyboard.
					clearProps: "clipPath",

					// A trigger of its own only when nothing else is keeping time. Inside a timeline, it
					// is that timeline's trigger that decides when this plays.
					...(timeline ? {} : {
						scrollTrigger: {
							trigger: block,
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
	}, { dependencies: [instant, timeline, position], scope: blockRef })

	// A JSX tag rather than createElement — see TextLineSplit for why the ref lint rule needs it.
	const Tag = as as unknown as React.FC<{
		ref?: React.Ref<HTMLElement>
		className?: string
		children?: ReactNode
	}>

	return <Tag ref={blockRef} className={className}>{children}</Tag>
}
