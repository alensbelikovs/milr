"use client"
import { createContext, useContext, useState } from "react"
import { createStore, type StoreApi } from "zustand/vanilla"
import { useStore } from "zustand/react"
import { type GeneralInformationType } from "@/types/ContentTypes"

// The site-wide singleton, fetched once on the server and put here so the two places that print it
// can both read it without either fetching anything.
//
// Those two sit as far apart in the tree as two things can: Footer is in the layout, and the sidebar
// menu is built at click time by SidebarContentStore. Both are client components, so neither can
// await server data — and a fetch in either would be a browser request that nothing dedupes, since
// React's cache() is server-only and Next's fetch memoization lasts one server render pass. Worse
// for the menu: Sidebar mounts its content fresh on every open (see contentKey), so a fetch on mount
// would fire again every time the panel is reopened. Fetched once in the layout and read from here,
// the count is one per render and zero per open.
//
// The store is made PER REQUEST and handed down, rather than created at module scope the way
// TransitionStore and the rest are. Those hold client state that starts empty and is only ever
// written in the browser; this one starts full, with data from the server, and that is the whole
// difference:
//
//   - useStore reads api.getInitialState() for its server snapshot — the state the store was BUILT
//     with — and React uses that snapshot both when rendering on the server and for the hydrating
//     render on the client. A module store built empty and filled by a later setState therefore
//     reads empty in both: the lists would be missing from the HTML entirely and pop in a frame
//     after hydration. Built with the data, getInitialState() IS the data, and it is right the first
//     time on both sides.
//   - A module-level store written during a server render is also shared by every request the Node
//     process is handling at once. Harmless for an address that is the same for everyone, but only
//     by luck, and the luck runs out the day anything per-visitor wants to live here.
//
// The value never changes after it is built, which is why there is no setter: this is a read-only
// container for one immutable object. A fresh copy — after the hour's revalidation, say — arrives
// the only way the root layout ever re-renders, which is a full load, and that builds a new store.
type GeneralInformationStoreType = {

	// The whole singleton as one object rather than its fields spread flat, because that is what lets
	// every reader select state => state.information and be done. Zustand v5 re-renders a consumer
	// whenever its selector returns a new reference, so a selector building { email, phone } would
	// re-render on every store read and need useShallow to stop it. One object that never changes
	// identity has no equality question to answer at all.
	//
	// Null on a studio whose singleton has never been saved, which is the one empty case each detail
	// list tests for.
	information: GeneralInformationType | null
}

const GeneralInformationContext =
	createContext<StoreApi<GeneralInformationStoreType> | null>(null)

export function GeneralInformationProvider(
	{ information, children }:
		{ information: GeneralInformationType | null, children: React.ReactNode }) {

	// Built once per mount, not per render — the initialiser form, so a re-render does not throw away
	// a store its readers are subscribed to.
	const [store] = useState(() =>
		createStore<GeneralInformationStoreType>(() => ({ information })))

	return (
		<GeneralInformationContext value={store}>
			{children}
		</GeneralInformationContext>
	)
}

// Throws rather than falling back to null when there is no provider above. A missing provider and an
// unsaved singleton would otherwise be the same empty column, and they are not the same problem —
// one is a studio nobody has filled in, the other is wiring that was forgotten.
export function useGeneralInformation<T>(selector: (state: GeneralInformationStoreType) => T): T {
	const store = useContext(GeneralInformationContext)
	if (!store) throw new Error("useGeneralInformation used outside GeneralInformationProvider")
	return useStore(store, selector)
}
