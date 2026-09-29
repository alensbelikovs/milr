import { type ReactNode } from "react"
import type { gsap } from "@/utils/gsap"
import HeadingSpanSerif from "@/components/typography/HeadingSpanSerif"
import TextLineSplit from "@/components/animation/TextLineSplit"

// instant passes straight through: it is the caller who knows whether this heading is worth waiting
// for a line at a time, or is already on screen when the page arrives and should simply be there.
//
// timeline/position pass straight through too, for the same reason: a heading that is the first
// step of a larger entrance — the one the contact section swaps in over its form — belongs on that
// sequence's clock rather than on a trigger of its own, which would fire the moment it was built
// because the block is already in view by then.
export default function Heading128(
	{ children, serif, mainHeading, className = "", instant = false, timeline, position = 0 }:
		{
			children: ReactNode
			serif?: string
			mainHeading?: boolean
			className?: string
			instant?: boolean
			timeline?: (() => gsap.core.Timeline) | null
			position?: number
		}) {
	return (
		<div className="col-span-full text-center">
			{/* One element with the tag chosen rather than two branches holding the same content, so
			    the h1 and the h2 cannot drift apart. The serif tag sits inside it so it is carried by
			    whichever line it lands on instead of standing still while the rest moves. */}
			<TextLineSplit
				as={mainHeading ? "h1" : "h2"}
				className={`text-size-128 ${className}`}
				instant={instant}
				timeline={timeline}
				position={position}>
				{children}
				{serif && <HeadingSpanSerif>{serif}</HeadingSpanSerif>}
			</TextLineSplit>
		</div>
	)
}
