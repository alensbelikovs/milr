"use client"
import { useCallback, useRef, useState } from "react"
import VideoBlogGridItem from "@/components/common/VideoBlogGridItem"
import type { VideoBlogType } from "@/types/ContentTypes"
import { variantAt } from "@/utils/variantAt"
import VideoBlogGridShowOverlay from "@/components/common/VideoBlogGridShowOverlay"

// Everything a grid of video blogs does beyond laying cards out: which blog is playing, and the
// overlay that plays it. The layout is the part that differs between the home grid and the editorial
// one, so it arrives as props — a container className and a rhythm of placement classes — and every
// grid gets the same modal behaviour without a second copy of it.
//
// The player is state and nothing else. It leaves no mark on the URL: no history entry to pop, no
// address to reload or share, nothing for the router to sync and nothing for TransitionControl to
// recognise and sit out. Opening a blog is as reversible as any other piece of component state, and
// Back still means the page before this one rather than the card before this one.
//
// The only client module in the set. VideoBlogGrid and VideoBlogGridSmall stay server components
// that hand this one strings, which is also what keeps the variants readable on the server: an
// array exported from a "use client" module comes back as a client-reference stub, so a rhythm
// defined in here could not be measured or mapped over by anything above it.
//
// stagger is seconds per card, multiplied by the index on the way in: a grid whose cards share a row
// hands one in so the row arrives left to right instead of all at once. A grid that reads as a
// column leaves it at zero — every card there crosses its own trigger already, and a delay on one
// would be lag rather than rhythm.
export default function VideoBlogGridShell(
	{ items, variants, className, stagger = 0 }:
	{ items: VideoBlogType[], variants: readonly string[], className: string, stagger?: number }
) {
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
	const close = useCallback(() => {
		setOpenBlog(null)
		triggerRef.current?.focus()
	}, [])

	return (
		<>
			<div className={className}>
				{items.map((item, index) => (
					<VideoBlogGridItem
						key={item.slug}
						blog={item}
						onOpen={open}
						className={variantAt(variants, index)}
						delay={index * stagger} />
				))}
			</div>
			{/* Always mounted, never conditional: the overlay hides itself by toggling display, so it
			    is still there to animate on the way out. Null is how it hears that nothing is open. */}
			<VideoBlogGridShowOverlay videoBlog={openBlog} onClose={close} />
		</>
	)
}
