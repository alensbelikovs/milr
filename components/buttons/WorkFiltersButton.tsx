"use client"
import { type ComponentProps } from "react"
import SidebarFilterBody from "@/components/sidebar/SidebarFilterBody"
import BodySpanSerif from "@/components/typography/BodySpanSerif"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// Opens the work filters in the sidebar, showing how many are applied
export default function WorkFiltersButton(props: ComponentProps<typeof SidebarFilterBody>) {
	const openWorkFilters = useSidebarContentStore(state => state.openWorkFilters)

	return (
		<button className="text-size-24 cursor-pointer group" onClick={() => openWorkFilters(props)}>
			<span className="group-hover:underline">Filters</span>
			<BodySpanSerif>( {props.active.sectors.length + props.active.solutions.length} )</BodySpanSerif>
		</button>
	)
}
