import ProjectGridItem from "@/components/common/ProjectGridItem"
import type { ProjectListType } from "@/types/ContentTypes"
import { variantAt } from "@/utils/variantAt"

// The placement rhythm the cards lay out on, kept beside the only grid that plays it — the blog
// grids keep theirs the same way.
//
// One Tailwind trap to know when editing these: col-span-N compiles to the grid-column SHORTHAND
// (`span N / span N`), so it rewrites the start as well as the end. A col-start from a smaller
// breakpoint is undone by any col-span at a larger one, because the later media query wins — restate
// the start at every breakpoint that restates the span. Within one breakpoint the order is safe:
// Tailwind emits col-start after col-span, and the order inside the class string never matters.
const PROJECT_VARIANTS = ([
	"col-start-1 col-span-full md:col-span-9 lg:col-span-6 *:aspect-16/10",
	"col-start-1 col-span-full md:col-start-8 md:col-span-5 lg:col-start-9 lg:mt-section lg:col-span-4 *:aspect-16/10 md:*:aspect-10/16",
	"col-start-1 col-span-full md:col-span-6 md:-mt-section lg:col-span-5 *:aspect-16/10 md:*:aspect-4/3",
	"col-start-1 col-span-full md:col-span-9 md:col-start-4 lg:col-start-7 lg:mt-section lg:col-span-6 *:aspect-16/10",
	"col-start-1 col-span-full md:col-span-5 lg:col-span-4 *:aspect-16/10 md:*:aspect-10/16 lg:-mt-section",
])

// The grid clips. The reveal parks every card half a viewport below its place, and a translated box
// still counts toward scrollable overflow, so unclipped the section grows by that much empty space
// and the page scrolls into it. The last row pays for it, rising into view from the grid's own
// bottom edge rather than from 50vh down.
//
// It clips the negative-margin variants too, which stays safe only while none of them lands in the
// first row — a card pulled above the grid's padding box loses whatever it is pulled past.
export default function ProjectGrid({ items }: { items: ProjectListType[] }) {
	return (
		<div
		className="
			pt-normal-2 pb-normal-3 grid grid-cols-12 items-start
			gap-x-regular gap-y-normal-2 overflow-hidden
		"
		>
			{items.map((item, index) => (
				<ProjectGridItem
					key={item.slug}
					project={item}
					className={variantAt(PROJECT_VARIANTS, index)} />
			))}
		</div>
	)
}
