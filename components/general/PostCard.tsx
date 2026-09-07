"use client"
import { type PostType } from "@/types/ContentTypes"
import Image from "next/image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import formatDate from "@/utils/formatDate"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

export default function PostCard({ post }: { post: PostType }) {
	const { title, media, _createdAt } = post
	const togglePost = useSidebarContentStore(state => state.togglePost)

	// The whole post goes into the store rather than an id to look up again — SidebarPostBody reads
	// externalUrl and media off it, and the card already holds everything it needs.
	return (
		<button
			type="button"
			onClick={() => togglePost(post)}
			className="col-span-1 relative group cursor-pointer text-left">
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
