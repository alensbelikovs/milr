import Link from "next/link"
import type { gsap } from "@/utils/gsap"
import ClipReveal from "@/components/animation/ClipReveal"
import ArrowRight from "@/components/icons/ArrowRight"

// A link wearing BodyButton's clothes: the same filled block, the same padding, the same arrow at
// the right edge. The two sit side by side — a form's submit and the link out of a section — and a
// reader should not have to work out which is which from how it looks. What differs is what it IS:
// this goes somewhere, so it is an anchor, which is what makes cmd-click, prefetch and the status
// bar work. The classes below are BodyButton's, minus the disabled states a link cannot have — and
// minus its width: the button fills the form column it was built for, while this is sized by its
// own label wherever it is dropped.
//
// The link is uncovered from the bottom up rather than moved into place — see ClipReveal. A filled
// block is a shape before it is anything else, and a shape that arrives by sliding a quarter of the
// screen spends that whole distance overlapping whatever it is going to sit above. Clipped, it only
// ever occupies the box it is going to keep.
//
// The reveal takes a div around the link rather than the anchor itself. The anchor is already a
// block — it is a flex row — so the clip would hold either way; the div is what carries the reveal's
// own placement in whatever holds this. Nothing is passed for that: every call site puts a BodyLink
// inside a flex column or a list item that already carries it.
//
// timeline/position are handed straight through to the reveal: a link that is one step of a larger
// entrance — the last line of a form's result, arriving after the words above it — opens on that
// sequence's clock rather than on a trigger of its own.
export default function BodyLink(
	{ children, target="_self", href="#", instant = false, timeline, position = 0, className, color }:
		{
			children: React.ReactNode
			target?: string
			href?: string
			instant?: boolean
			timeline?: (() => gsap.core.Timeline) | null
			position?: number,
			className?: string,
			color?: string
		})
{
	return (
		<ClipReveal as="div" className={className} instant={instant} timeline={timeline} position={position}>
			<Link
				className={`
				group text-size-16
				gap-size-96 w-full lg:w-fit
				flex items-center justify-between
				cursor-pointer capitalize
				${
					color ? color
					: "bg-foreground/10 backdrop-blur-2xl hover:bg-foreground text-foreground hover:text-background"
				}
				rounded-sm p-size-16 lg:p-size-12
				disabled:bg-foreground/10 disabled:text-foreground/40 disabled:cursor-not-allowed`}
				href={href}
				target={target}>
				{/* A span around the words, so the arrow is the flex row's other item and the gap has
				    two things to hold apart rather than one text node.

				    w-fit above is what keeps the block off the full width of whatever holds it: a
				    block-level flex box fills its container otherwise, and every call site puts this
				    in a stretched flex column. w-fit rather than inline-flex, so the box still sits
				    on its own line with no baseline descender gap under it, and its placement stays
				    the parent's business rather than whatever text-align happens to be inherited.
				    With the box sized to its content there is no free space left for
				    justify-between to hand out — the gap is what sets the words apart from the
				    arrow now. It is kept for the case where a parent does constrain the width. */}
				<span>{ children }</span>
				{/* The arrow sits here at rest and makes one trip on hover: out to the right, around,
				    and back in from the left — see arrow-cycle. The clipping box is what it leaves
				    through and comes back through; overflow-hidden here rather than on the svg,
				    because the svg is what moves — clipped by itself, it would carry its own mask
				    along. flex, so the box is exactly the icon's size with no line-height gap under
				    it. */}
				<span className="relative flex overflow-hidden">
					<ArrowRight
						dimensions={14}
						fill="currentColor"/>
				</span>
			</Link>
		</ClipReveal>
	)
}
