"use client"

import CardGrid from "@/components/common/CardGrid"
import VideoBlogGridItem from "@/components/common/VideoBlogGridItem"
import VideoBlogGridShowOverlay from "@/components/common/VideoBlogGridShowOverlay"
import useVideoPlayer from "@/hooks/useVideoPlayer"
import type { VideoBlogType } from "@/types/ContentTypes"

// The one thing a grid of video blogs needs that a grid of projects does not: somewhere for the
// player to live. Projects call CardGrid directly, because a project card is a link and a link needs
// no state; a blog card opens a dialog on the page it is already on, and that is state, and state
// needs a client component to hold it.
//
// So this wraps CardGrid and nothing else. The layout is not its business and it does not pretend
// otherwise — variants, container and spacer arrive as props and go straight through, because the
// editorial grid and the home teaser are different shapes of the same thing. What it owns is the
// open blog, the overlay, and the focus that has to come back to the card afterwards.
//
// One wrapper rather than a useVideoPlayer call in each grid: the pass-through is the price, and a
// single place where opening a blog is defined is what it buys.
//
// stagger is seconds per card, multiplied by the index on the way in. A grid whose cards share a row
// hands one in so the row arrives left to right instead of all at once; a grid that reads as a
// column leaves it at zero, because every card there crosses its own trigger already and a delay
// would be lag rather than rhythm.
export default function VideoBlogGridWrapper(
	{ items, variants, className, cycleSpacer, stagger = 0 }:
	{
		items: VideoBlogType[],
		variants: readonly string[],
		className: string,
		cycleSpacer?: string,
		stagger?: number
	}
) {
	const { openBlog, open, close } = useVideoPlayer()

	return (
		<>
			<CardGrid
				items={items}
				variants={variants}
				className={className}
				cycleSpacer={cycleSpacer}
				getKey={blog => blog.slug}
				renderCard={(blog, cardClassName, index) => (
					<VideoBlogGridItem
						blog={blog}
						onOpen={open}
						className={cardClassName}
						delay={index * stagger} />
				)} />
			{/* Always mounted, never conditional: the overlay hides itself by toggling display, so it
			    is still there to animate on the way out. Null is how it hears that nothing is open. */}
			<VideoBlogGridShowOverlay videoBlog={openBlog} onClose={close} />
		</>
	)
}
