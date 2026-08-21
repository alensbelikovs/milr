import VideoBlogGridShell from "@/components/common/VideoBlogGridShell"
import type { VideoBlogType } from "@/types/ContentTypes"

// One entry, not three. Every card in this grid is placed the same way, and variantAt wraps, so a
// single-entry rhythm dresses all three — and keeps tiling three-up if the section ever features
// more. The 3/4 ratio is not here because VideoBlogGridItem already appends it to whatever variant
// it is handed.
const BLOG_VARIANTS_SMALL = ([
	"col-span-4",
])

// The step between cards, in seconds. All three sit on one line, so their triggers fire at the same
// scroll position and, left alone, the row arrives as a single slab — the step is what makes it read
// left to right. ScrollReveal spends it above md only: narrower than that, the row is too tight for
// a sequence to register and the same step lands as lateness instead.
const STAGGER_STEP = 0.1

// Three even cards across a 12-column grid — 1-4, 5-8, 9-12 — for the home section, against the
// staggered edge-to-edge rhythm VideoBlogGrid plays on a page of nothing but blogs.
//
// px-regular on top of the section's own inset the cards a gutter further in than the heading above
// them, which is the padding column the layout wants without spending a grid column on it.
//
// The grid clips. The reveal parks every card half a viewport below its place, and a translated box
// still counts toward scrollable overflow, so unclipped the section grows by that much empty space
// and the page scrolls into it. The last row pays for it, rising into view from the grid's own
// bottom edge rather than from 50vh down.
export default function VideoBlogGridSmall({ items }: { items: VideoBlogType[] }) {
	return (
		<VideoBlogGridShell
			items={items}
			variants={BLOG_VARIANTS_SMALL}
			stagger={STAGGER_STEP}
			className="
				py-normal-2 px-regular grid grid-cols-12 items-start
				gap-x-regular gap-y-normal-2 overflow-hidden
			" />
	)
}
