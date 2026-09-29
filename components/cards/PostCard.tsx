"use client"
import { type PostType } from "@/types/ContentTypes"
import Image from "@/components/media/Image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import formatDate from "@/utils/formatDate"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import ScrollReveal from "@/components/animation/ScrollReveal"

// index is the card's place in its row, handed down by the grid — it is the grid that knows how
// many columns it has. See ScrollReveal for what it is used for.
export default function PostCard(
	{ post, index = 0 }:
		{ post: PostType; index?: number }) {
	const { title, media, _createdAt } = post
	const togglePost = useSidebarContentStore(state => state.togglePost)

	// A column, rather than a button left to its own devices: a button renders its contents as one
	// anonymous box centred in the button, so a card stretched to a taller neighbour's height — which
	// is what a two-line title next to a three-line one does — pushes its own image down by half the
	// difference. Laying the children out as a flex column tops them out instead, which is what keeps
	// the images across a row on one line. h-full so the card fills the row it was stretched to.
	return (
		<button
			type="button"
			onClick={() => togglePost(post)}
			className="col-span-1 h-full flex flex-col items-stretch justify-start
				relative group cursor-pointer text-left">
			<PointerOverlayTrigger />
			<ScrollReveal index={index} />
			<div className="bg-image-placeholder aspect-3/4 relative overflow-hidden">
				{
					media &&
					<div className="absolute inset-0 scale-110 group-hover:scale-100">
						<Image
							src={buildImageUrl(media, CARD)}
							alt={title}
							quality={99}
							className="w-full h-full object-cover" />
					</div>
				}
			</div>
			<div className="mt-size-16 grid grid-cols-3 gap-size-16">
				<p className="text-size-14">{formatDate(_createdAt)}</p>
				<h3 className="text-size-24 group-hover:underline col-span-2 row-start-2">{title}</h3>
			</div>

		</button>
	)
}
