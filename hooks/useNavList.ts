"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { useTransitionStore } from "@/store/TransitionStore"
import { getNavList } from "@/lib/routes"
import type { ListLinkItem } from "@/components/actions/ListItem"

// The pages to offer next from wherever the reader is. All of the ordering lives in getNavList,
// which is a pure function of the pathname — this only decides WHICH pathname to hand it.
//
// And that is the whole reason it reads the store. usePathname flips as soon as the router commits,
// which is while TransitionControl is still fading the curtain in over the page being left; context
// reaches into that frozen tree regardless of its element identity, so a list built from usePathname
// would reshuffle itself in plain view — dropping the link to the page the reader is about to arrive
// on, restoring the one they are still looking at — a beat before the swap. committedPathname is
// written in the same call that swaps the tree, so it always describes what is actually on screen.
//
// Null until that first commit: a server render, and the frames before TransitionControl's effect
// has run. usePathname is right in that window — nothing has navigated yet, so the two agree — and
// it is also what keeps this correct on the server, where the store is a fresh empty instance.
export function useNavList(): ListLinkItem[] {
	const committedPathname = useTransitionStore(state => state.committedPathname)
	const pathname = usePathname()
	const current = committedPathname ?? pathname

	// A new array every render would be a new value for any consumer that keys an effect or a
	// memo on it, and this changes only when the page does.
	return useMemo(() => getNavList(current), [current])
}
