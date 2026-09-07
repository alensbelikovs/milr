"use client"
import { create } from "zustand"
import { isValidElement } from "react"
import SidebarMenuBody from "@/components/actions/SidebarMenuBody"
import SidebarPostBody from "@/components/actions/SidebarPostBody"
import { type PostType } from "@/types/ContentTypes"

type SidebarContentStoreType = {

	// What the sidebar is showing, and by being non-null, THAT it is showing at all. Sidebar derives
	// its open state from this rather than carrying a second boolean, so the two cannot disagree —
	// there is no state where the panel is open over nothing, or holds content nobody can see.
	sidebarContent: React.ReactNode | null

	toggleNav: () => void
	togglePost: (post: PostType) => void
	closeSidebar: () => void
}

export const useSidebarContentStore = create<SidebarContentStoreType>((set, get) => ({
	sidebarContent: null,

	// Toggles against what is actually on screen rather than a caller-side "is open" flag, so the
	// Menu button stays correct no matter what else has written to the store since it was pressed.
	//
	// The check is on element TYPE, not on the node being non-null: with a post open, Menu swaps to
	// the menu instead of closing. Closing there would make one press do two different things
	// depending on state the reader never chose.
	toggleNav: () => {
		const current = get().sidebarContent
		const showingNav = isValidElement(current) && current.type === SidebarMenuBody
		set({ sidebarContent: showingNav ? null : <SidebarMenuBody /> })
	},

	// Always replaces, never toggles. Clicking a second card while a post is open swaps the content
	// — the reader asked to see that post, and closing the panel is not that.
	togglePost: post => set({ sidebarContent: <SidebarPostBody post={post} /> }),

	closeSidebar: () => set({ sidebarContent: null }),
}))
