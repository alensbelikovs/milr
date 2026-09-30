"use client"
import { create } from "zustand"

type MobileSheetStoreType = {

	// What the mobile sheet is showing, and by being non-null, THAT it is showing — the same shape as
	// SidebarContentStore, for the same reason: one value, so the open state and the content can never
	// disagree. In a store rather than in the sheet because the navbar's menu button has to know too:
	// while this is open the button is its cross, and a press on it closes this.
	content: React.ReactNode | null

	open: (content: React.ReactNode) => void
	close: () => void
}

export const useMobileSheetStore = create<MobileSheetStoreType>(set => ({
	content: null,
	open: content => set({ content }),
	close: () => set({ content: null }),
}))
