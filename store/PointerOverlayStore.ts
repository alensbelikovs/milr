"use client"
import { create } from "zustand"

type PointerOverlayStoreType = {
	label: string | null,
	// Pointer position on enter, so the label appears in place before the first move
	origin: { x: number, y: number } | null,
	showOverlay: (label: string, origin: { x: number, y: number }) => void,
	hideOverlay: () => void
}

export const usePointerOverlayStore = create<PointerOverlayStoreType>(set => ({
	label: null,
	origin: null,
	showOverlay: (label, origin) => set({ label, origin }),
	hideOverlay: () => set({ label: null }),
}))
