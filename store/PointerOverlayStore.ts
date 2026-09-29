"use client"
import { create } from "zustand"

type PointerOverlayStoreType = {

	// What the pointer is over and what to call it, or null for nothing worth labelling. The label
	// the reader actually sees outlives this by a moment — see PointerOverlay, which holds it through
	// a short delay so crossing from one item to the next does not blink.
	label: string | null

	// Where the pointer was when it crossed in. Carried because the label has to be in the right
	// place on the frame it appears, and the only thing that knows the position before the first
	// pointermove is the enter event that opened it.
	origin: { x: number, y: number } | null

	showOverlay: (label: string, origin: { x: number, y: number }) => void
	hideOverlay: () => void
}

// One label for the whole document, driven from wherever the pointer happens to be. A store rather
// than props because the two ends sit at opposite ends of the tree: the thing that knows what is
// being hovered is a card deep in a page, and the thing that draws it is in the layout.
export const usePointerOverlayStore = create<PointerOverlayStoreType>(set => ({
	label: null,
	origin: null,

	// Replaces whatever was showing, so moving from one card straight onto another swaps the word
	// rather than closing and reopening.
	showOverlay: (label, origin) => set({ label, origin }),

	// Only says the pointer left. How long the label lingers is the overlay's decision, not the
	// caller's — every caller would otherwise have to agree on the same number.
	hideOverlay: () => set({ label: null }),
}))
