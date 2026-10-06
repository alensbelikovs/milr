import Image from "next/image"
import Link from "next/link"
import ScrollReveal from "@/components/animation/ScrollReveal"
import TextLineSplit from "@/components/animation/TextLineSplit"
import ImageDimmer from "@/components/media/ImageDimmer"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import formatDate from "@/utils/formatDate"
import { type Post } from "@/types/CommonTypes"

// A post opened up: date, title and description, with its picture linking out to the post's url
export default function SidebarPostBody({ post }: { post: Post }) {
	const { title, description, _createdAt, img, url } = post

	return (
		<div className="grid grid-cols-6 px-size-24 gap-x-size-24 py-size-96">
			<div className="
				col-start-2 col-span-4
				flex flex-col items-center gap-size-96 text-center
			">
				<div className="flex flex-col gap-size-48">
					<p className="text-size-18 font-serif text-foreground/50">{formatDate(_createdAt)}</p>
					<TextLineSplit as="h3" className="text-size-48">
						{title}
					</TextLineSplit>
					<TextLineSplit className="text-size-18">
						{description}
					</TextLineSplit>
				</div>
				<div className="
					group w-full relative overflow-hidden aspect-3/4
					bg-image-placeholder
				">
					<ScrollReveal delay={0.05} />
					{
						img &&
						<>
							<div className="
								absolute inset-0 scale-105
								group-hover:scale-100
								transition-[scale] duration-300 ease-out
							">
								<Image
									src={buildImageUrl(img.src, CARD)}
									alt={img.alt ?? title}
									fill
									sizes="(min-width: 48rem) 33vw, 66vw"
									quality={99}
									className="object-cover" />
							</div>
							<ImageDimmer />
						</>
					}
					<Link
						href={url}
						target="_blank"
						className={`
							absolute inset-0 flex items-center justify-center
							text-size-24 group-hover:underline
							${img ? "text-background" : "text-foreground"}
						`}>
						View
					</Link>
				</div>
			</div>
		</div>
	)
}
