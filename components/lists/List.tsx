"use client"
import { createContext, useRef, useState, type ReactNode } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/utils/gsap"

// How far apart the rows start. The rows join the list's timeline at index × this, so the list
// arrives as one cascade rather than as rows each keeping their own time.
export const LIST_STAGGER = 0.1

// The list's timeline, for its rows to add themselves to. A getter rather than the timeline itself
// — see List for why it cannot exist yet when the rows first need it.
export const ListTimelineContext = createContext<(() => gsap.core.Timeline) | null>(null)

// One entrance for the whole list: a single paused timeline that every row adds its pieces to at its
// own offset, played by a single trigger on the list. With a trigger per row, rows that come into
// view together would start together, and the order the reader should see them in would be lost.
export default function List(
	{
		children,
		className = "col-start-2 col-span-5"
	}:
	{ children: ReactNode; className?: string })
{
	const listRef = useRef<HTMLUListElement>(null)

	// Made on first ask rather than during render, for two reasons. A client component still renders
	// on the server, and a timeline made there would be left on the server's own global timeline for
	// every request. And the rows' effects run BEFORE this component's — children commit first — so
	// they have to be able to bring the timeline into being themselves.
	//
	// dispose clears the slot, so the next ask makes a new one. That is what a remount needs — dev's
	// StrictMode unmounts and remounts every effect once, and a killed timeline will not play again.
	const [sequence] = useState(() => {
		let timeline: gsap.core.Timeline | null = null
		return {
			get: () => timeline ??= gsap.timeline({ paused: true }),
			dispose: () => {
				timeline?.kill()
				timeline = null
			},
		}
	})

	useGSAP(() => {
		const list = listRef.current
		if (!list) return

		// The list, which never moves, rather than any row — the rows are what is being animated.
		// Asked for lazily when it fires, so it plays whichever timeline the rows ended up in.
		ScrollTrigger.create({
			trigger: list,
			start: "top bottom",
			once: true,
			onEnter: () => { sequence.get().play() },
		})

		return () => { sequence.dispose() }
	}, { scope: listRef })

	return (
		<ListTimelineContext value={sequence.get}>
			<ul ref={listRef} className={className}>
				{children}
			</ul>
		</ListTimelineContext>
	)
}
