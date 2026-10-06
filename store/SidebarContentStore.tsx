"use client"
import { type ComponentProps } from "react"
import { create } from "zustand"
import { type SectionNavLink } from "@/components/navigation/SectionNavWrapper"
import SidebarFilterBody from "@/components/sidebar/SidebarFilterBody"
import SidebarMenuBody from "@/components/sidebar/SidebarMenuBody"
import SidebarPostBody from "@/components/sidebar/SidebarPostBody"
import SidebarSectionNavBody from "@/components/sidebar/SidebarSectionNavBody"
import SidebarSolutionBody from "@/components/sidebar/SidebarSolutionBody"
import { type Post, type Solution } from "@/types/CommonTypes"

type SidebarContentStoreType = {
	// The sidebar is open whenever this is not null
	sidebarContent: React.ReactNode | null,
	toggleNav: () => void,
	openPost: (post: Post) => void,
	openSolution: (solution: Solution) => void,
	openWorkFilters: (props: ComponentProps<typeof SidebarFilterBody>) => void,
	openSectionNav: (links: SectionNavLink[]) => void,
	closeSidebar: () => void
}

// Every open replaces what is showing; only the menu button toggles
export const useSidebarContentStore = create<SidebarContentStoreType>((set, get) => ({
	sidebarContent: null,
	toggleNav: () => set({ sidebarContent: get().sidebarContent === null ? <SidebarMenuBody /> : null }),
	openPost: post => set({ sidebarContent: <SidebarPostBody post={post} /> }),
	openSolution: solution => set({ sidebarContent: <SidebarSolutionBody solution={solution} /> }),
	openWorkFilters: props => set({ sidebarContent: <SidebarFilterBody {...props} /> }),
	openSectionNav: links => set({ sidebarContent: <SidebarSectionNavBody links={links} /> }),
	closeSidebar: () => set({ sidebarContent: null }),
}))
