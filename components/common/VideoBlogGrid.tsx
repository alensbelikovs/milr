import VideoBlogGridShell from "@/components/common/VideoBlogGridShell"
import type { VideoBlogType } from "@/types/ContentTypes"

// The wide ones pull their title in to 3/4, so a long title wraps instead of running the full
// col-span-5. The narrow ones have no room to give and keep the w-full the item ships with.
const BLOG_VARIANTS = ([
	"col-start-1 col-span-5 [&_h3]:w-3/4",
	"col-start-11 col-span-3",
	"col-start-1 col-span-3",
	"col-span-5 col-start-11 [&_h3]:w-3/4",
])

// The editorial rhythm: cards of two widths pinned to opposite edges of a 15-column grid, read as a
// column down the page rather than a row across it. VideoBlogGridSmall is the even three-up version
// the home section wants; both hand their layout to the same shell, which owns the player.
//
// The grid clips. The reveal parks every card half a viewport below its place, and a translated box
// still counts toward scrollable overflow, so unclipped the section grows by that much empty space
// and the page scrolls into it. The last row pays for it, rising into view from the grid's own
// bottom edge rather than from 50vh down.
export default function VideoBlogGrid({ items }: { items: VideoBlogType[] }) {
	return (
		<VideoBlogGridShell
			items={items}
			variants={BLOG_VARIANTS}
			className="
				py-normal-2 grid grid-cols-15 items-start
				gap-x-regular overflow-hidden
			" />
	)
}
