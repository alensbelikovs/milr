"use client"
import { type ComponentProps } from "react"
import TextLineSplit from "@/components/animation/TextLineSplit"
import { useSite } from "@/components/layout/SiteProvider"
import SidebarFilterBody from "@/components/sidebar/SidebarFilterBody"
import BodySpanSerif from "@/components/typography/BodySpanSerif"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// Opens the work filters in the sidebar, showing how many are applied
export default function WorkFiltersButton(props: ComponentProps<typeof SidebarFilterBody>) {
	const { dict } = useSite()
	const openWorkFilters = useSidebarContentStore(state => state.openWorkFilters)

	const activeCount = props.active.sectors.length + props.active.solutions.length

	// Beside HeroList's heading from lg, under it (matching its columns) below that.
	// Keyed so the split is redone when the count changes, rather than React editing split markup.
	// Padding on each line keeps the underline inside its mask.
	return (
		<div className="
			col-start-1 col-span-full mt-size-48
			md:col-start-2 md:col-span-10
			lg:col-start-7 lg:col-span-5 lg:mt-0
			flex items-end
		">
			<button className="text-size-24 cursor-pointer group" onClick={() => openWorkFilters(props)}>
				<TextLineSplit key={activeCount} as="span" linesClassName="pb-1">
					<span className="group-hover:underline">{dict.work.filters}</span>
					<BodySpanSerif>( {activeCount} )</BodySpanSerif>
				</TextLineSplit>
			</button>
		</div>
	)
}
