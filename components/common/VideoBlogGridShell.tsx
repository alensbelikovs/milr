"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import VideoBlogGridItem from "@/components/common/VideoBlogGridItem"
import type { VideoBlogType } from "@/types/ContentTypes"
import { variantAt } from "@/utils/variantAt"
import { VIDEO_BLOG_SHOW_PATH, videoBlogShowPath } from "@/utils/videoBlogRoute"
import VideoBlogGridShowOverlay from "@/components/common/VideoBlogGridShowOverlay"

// Everything a grid of video blogs does beyond laying cards out: which blog is playing, the URL it
// wears while it plays, and the overlay itself. The layout is the part that differs between the
// home grid and the editorial one, so it arrives as props — a container className and a rhythm of
// placement classes — and every grid gets the same modal behaviour without a second copy of it.
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

	const pathname = usePathname()

	// The page the grid sits on, captured before the URL moves. Read back on close, so wherever this
	// grid ends up mounted — the home section today, /video-blog later — the modal returns to it
	// rather than to a hardcoded path.
	const basePathRef = useRef(pathname)

	// The card that opened the dialog, so focus can go back to it. Read off document.activeElement
	// rather than plumbed up through a ref on every item: the card is whatever was focused when the
	// press happened, and the grid does not otherwise need to know its DOM node.
	const triggerRef = useRef<HTMLElement | null>(null)

	// Opening pushes, so Back has an entry to pop. Switching blogs with one already open replaces
	// instead — otherwise browsing four blogs leaves four entries to walk back through before the
	// grid reappears.
	//
	// pushState is the documented way to move the URL without a reload: Next syncs it into
	// usePathname and mounts nothing, which is the whole trick behind /video-blog/<slug> not being a
	// real route. TransitionControl recognises the path and sits the navigation out.
	const open = (blog: VideoBlogType) => {
		if (!openBlog) {
			basePathRef.current = pathname
			triggerRef.current = document.activeElement as HTMLElement | null
		}
		setOpenBlog(blog)
		window.history[openBlog ? "replaceState" : "pushState"](null, "", videoBlogShowPath(blog.slug))
	}

	// Closes now and lets history catch up: back() pops the entry open() pushed, which restores the
	// base path without stacking a third one. Clearing state first rather than waiting on popstate
	// keeps the dialog from lingering for a frame.
	//
	// Stable across renders because the overlay binds it to a document listener — a fresh identity
	// every render would tear that listener down and rebuild it every time.
	const close = useCallback(() => {
		setOpenBlog(null)
		triggerRef.current?.focus()
		window.history.back()
	}, [])

	// The URL is the other half of this state and the browser can move it on its own, so history gets
	// subscribed to like any other external source. Back lands on the base path and clears the blog;
	// Forward lands on the modal path again and the slug in it names the blog to reopen.
	//
	// popstate rather than a watch on usePathname, because only a traversal should reach here — the
	// pushState in open() and the state it sets are already in step, and popstate stays silent for it.
	useEffect(() => {
		const onPopState = () => {
			const slug = window.location.pathname.match(VIDEO_BLOG_SHOW_PATH)?.[1]
			setOpenBlog(slug ? items.find(item => item.slug === slug) ?? null : null)
		}
		window.addEventListener("popstate", onPopState)
		return () => window.removeEventListener("popstate", onPopState)
	}, [items])

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
			{openBlog && <VideoBlogGridShowOverlay videoBlog={openBlog} onClose={close} />}
		</>
	)
}
