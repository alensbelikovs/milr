"use client"
import { create } from "zustand"
import SidebarMenuBody from "@/components/sidebar/SidebarMenuBody"
import SidebarPostBody from "@/components/sidebar/SidebarPostBody"
import SidebarGeneralBody from "@/components/sidebar/SidebarGeneralBody"
import { type PostType, type ServiceType } from "@/types/ContentTypes"

type SidebarContentStoreType = {

	// What the sidebar is showing, and by being non-null, THAT it is showing at all. Sidebar derives
	// its open state from this rather than carrying a second boolean, so the two cannot disagree —
	// there is no state where the panel is open over nothing, or holds content nobody can see.
	sidebarContent: React.ReactNode | null

	toggleNav: () => void
	openNav: () => void
	togglePost: (post: PostType) => void
	openService: (service: ServiceType) => void
	closeSidebar: () => void
}

export const useSidebarContentStore = create<SidebarContentStoreType>((set, get) => ({
	sidebarContent: null,

	// Toggles against what is actually on screen rather than a caller-side "is open" flag, so the
	// Menu button stays correct no matter what else has written to the store since it was pressed.
	//
	// Open means open, whatever is in it: with a post or a service showing, Menu closes the panel
	// rather than swapping the menu in. The button sits in the same place over every panel, so it
	// reads as the way out of the sidebar — pressing it and finding yourself in another panel is
	// not what anyone reaching for it that way meant.
	toggleNav: () => {
		const open = get().sidebarContent !== null
		set({ sidebarContent: open ? null : <SidebarMenuBody /> })
	},

	// Opens, and only opens. A caller that means "show the menu" should not close it because of
	// what happened to be on screen when it was pressed — toggling is the Menu button's job alone.
	openNav: () => set({ sidebarContent: <SidebarMenuBody /> }),

	// Always replaces, never toggles. Clicking a second card while a post is open swaps the content
	// — the reader asked to see that post, and closing the panel is not that.
	togglePost: post => set({ sidebarContent: <SidebarPostBody post={post} /> }),

	// The service's title, its description and its picture — the same one its row shows beside the
	// list. Replaces rather than toggles, the same as a post: picking a second row swaps the panel
	// over to it.
	openService: service => set({
		sidebarContent: (
			<SidebarGeneralBody
				title={service.title}
				body={service.description}
				media={service.media ?? undefined} />
		),
	}),

	closeSidebar: () => set({ sidebarContent: null }),
}))
