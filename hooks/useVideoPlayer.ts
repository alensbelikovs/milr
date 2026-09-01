"use client"

import { useCallback, useRef, useState } from "react"
import type { VideoBlogType } from "@/types/ContentTypes"

// The player behind a grid of video blogs: which blog is showing, and how the grid gets focus back
// when it closes. Every grid of blogs needs exactly this and none of them needs it differently, so
// it is a hook rather than a wrapper component — each grid keeps rendering its own cards and its own
// overlay, and this owns nothing but the state between them.
//
// It was a component once, and the shape gave it away: a shell holding this state had to forward a
// container className, a rhythm and a spacer straight through to the grid underneath it, because
// none of that was ever its business. A hook keeps the state and hands the layout back.
//
// The player is state and nothing else. It leaves no mark on the URL: no history entry to pop, no
// address to reload or share, nothing for the router to sync and nothing for TransitionControl to
// recognise and sit out. Opening a blog is as reversible as any other piece of component state, and
// Back still means the page before this one rather than the card before this one.
export default function useVideoPlayer() {
	// The blog whose player is open, or null while the grid is just a grid. Holding the blog rather
	// than a boolean is what lets the overlay read straight off it.
	const [openBlog, setOpenBlog] = useState<VideoBlogType | null>(null)

	// The card that opened the dialog, so focus can go back to it. Read off document.activeElement
	// rather than plumbed up through a ref on every item: the card is whatever was focused when the
	// press happened, and the grid does not otherwise need to know its DOM node.
	const triggerRef = useRef<HTMLElement | null>(null)

	// Only the first open captures a card. With the dialog already up, whatever is focused is inside
	// it, and focus on close belongs back where the reader left the grid.
	const open = (blog: VideoBlogType) => {
		if (!openBlog) triggerRef.current = document.activeElement as HTMLElement | null
		setOpenBlog(blog)
	}

	// Stable across renders because the overlay binds it to a document listener — a fresh identity
	// every render would tear that listener down and rebuild it every time.
	//
	// preventScroll, and it is load-bearing rather than tidiness. A bare focus() scrolls the focused
	// element into view, and nothing stops the page scrolling behind an open modal — the overlay root
	// is fixed and Lenis listens on window — so the card is often no longer where it was. Left alone,
	// closing yanks the page back to it: up if the reader scrolled down, down if they scrolled up.
	//
	// It reads as a hard snap rather than a glide because Lenis drives the real document scroll in
	// root mode. A native scroll-into-view moves window.scrollY outside its rAF loop, so its internal
	// target still holds the old value and the next wheel event pulls against the jump.
	//
	// Focus still returns to the card, which is the part that matters for anyone tabbing: the same
	// call the overlay already makes on open, with the same guard.
	const close = useCallback(() => {
		setOpenBlog(null)
		triggerRef.current?.focus({ preventScroll: true })
	}, [])

	return { openBlog, open, close }
}
