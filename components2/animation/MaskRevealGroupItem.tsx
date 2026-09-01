import type { ReactNode } from "react"

// What MaskRevealGroup collects. Written out as a literal in the JSX below rather than built from
// this constant, so the attribute is greppable from the markup side as well as the selector side.
export const REVEAL_ITEM_SELECTOR = "[data-mask-reveal-item]"

// One line of a group reveal: an overflow-hidden box with the content in a box of its own, so the
// inner one can travel up into the outer one and be clipped on the way.
//
// It runs nothing itself — no hook, no trigger, not even a client boundary. The group above sets the
// from-state and plays every item it finds, which is the whole point: a column of these enters as
// one movement rather than as a dozen elements that each noticed the viewport separately.
export default function MaskRevealGroupItem(
	{ children, className }:
		{ children: ReactNode; className?: string })
{
	return (
		<span className={`block overflow-hidden ${className ?? ""}`.trim()}>
			{/* inline-block so the span accepts a transform and can be clipped. */}
			<span data-mask-reveal-item="" className="inline-block">
				{children}
			</span>
		</span>
	)
}
