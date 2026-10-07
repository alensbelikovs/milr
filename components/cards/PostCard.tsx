"use client"
import ScrollReveal from "@/components/animation/ScrollReveal"
import Image from "@/components/media/Image"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import formatDate from "@/utils/formatDate"
import { type Post } from "@/types/CommonTypes"

// delay staggers the reveal (desktop only)
export default function PostCard({ post, delay }: { post: Post, delay?: number }) {
	const { title, img, _createdAt } = post
	const openPost = useSidebarContentStore(state => state.openPost)

	return (
		<button
			type="button"
			onClick={() => openPost(post)}
			className="
				col-span-1 h-full relative group
				flex flex-col items-stretch justify-start
				cursor-pointer text-left
			">
			<PointerOverlayTrigger />
			<ScrollReveal delay={delay} />
			<div className="bg-image-placeholder aspect-3/4 relative overflow-hidden">
				{
					img &&
					<div className="
						absolute inset-0 scale-105
						group-hover:scale-100
						transition-[scale] duration-300 ease-out
					">
						<Image
							src={buildImageUrl(img.src, CARD)}
							alt={img.alt ?? title}
							fill
							sizes="(min-width: 48rem) 22vw, 50vw"
							quality={99}
							className="object-cover" />
					</div>
				}
			</div>
		</button>
	)
}
