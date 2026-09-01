import VideoBlogGridWrapper from "@/components/common/VideoBlogGridWrapper"
import type { VideoBlogType } from "@/types/ContentTypes"
import { BLOG_SMALL_VARIANTS } from "@/utils/gridVariants"

// The step between cards, in seconds. All three sit on one line, so their triggers fire at the same
// scroll position and, left alone, the row arrives as a single slab — the step is what makes it read
// left to right. ScrollReveal spends it above md only: narrower than that, the row is too tight for
// a sequence to register and the same step lands as lateness instead.
const STAGGER_STEP = 0.1

// Three even cards across a 12-column grid — 1-4, 5-8, 9-12 — for the home section, against the
// staggered edge-to-edge rhythm /diary plays on a page of nothing but blogs. Same cards, same
// player, its own shape: the rhythm lives in gridVariants with every other one, and what is left
// here is the box those three cards sit in and the step between them.
//
// No cycle spacer: with a one-entry rhythm every card would close a cycle, and the break would land
// between all of them.
//
// px-regular on top of the section's own inset the cards a gutter further in than the heading above
// them, which is the padding column the layout wants without spending a grid column on it.
//
// The grid clips. The reveal parks every card half a viewport below its place, and a translated box
// still counts toward scrollable overflow, so unclipped the section grows by that much empty space
// and the page scrolls into it. The last row pays for it, rising into view from the grid's own
// bottom edge rather than from 50vh down.
//
// pb-normal-3 rather than a symmetric py, and it is the clip that makes it necessary. CardGridItem
// puts the ratio on the card so it measures the cover alone, which leaves the caption hanging below
// the box its row is measured from — and this grid clips at its padding edge, so the bottom padding
// is the room that caption has before it is cut off. A blog caption is the taller of the two, date
// over title, so it needs the deeper step rather than the one the top gets.
export default function VideoBlogGridSmall({ items }: { items: VideoBlogType[] }) {
	return (
		<VideoBlogGridWrapper
			items={items}
			variants={BLOG_SMALL_VARIANTS}
			stagger={STAGGER_STEP}
			className="
				pt-normal-2 pb-normal-3 grid grid-cols-12 items-start
				gap-x-regular gap-y-normal-2 overflow-hidden
			" />
	)
}
