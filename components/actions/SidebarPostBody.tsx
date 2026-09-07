"use client"
import { type PostType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"
import Image from "next/image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import Link from "next/link"

export default function SidebarPostBody(
	{ post }:
		{ post: PostType }) {
	const { title, _createdAt, media, externalUrl } = post

	return (
		<div className="grid grid-cols-6
			px-size-24 gap-x-size-24
			gap-y-size-96 pt-size-96">
			<div className="col-start-2 col-span-4 flex gap-size-96 flex-col items-center text-center">
				<div className="flex flex-col gap-size-48">
					<p className="text-size-18 font-serif text-foreground/50">{formatDate(_createdAt)}</p>
					<h3 className="text-size-48">{title}</h3>
				</div>
				<div className="
					relative
					overflow-hidden aspect-3/4
					w-full
					flex items-center justify-center
					bg-image-placeholder group">
					{
						media &&
						<div className="absolute inset-0 scale-110 group-hover:scale-100">
							<Image
								src={buildImageUrl(media, CARD)}
								alt={title}
								quality={99}
									className="w-full h-full object-cover" />
							<div className="bg-foreground/20"/>
						</div>
					}
					<Link
						href={externalUrl}
						target="_blank"
						className={`absolute inset-0 flex items-center
						justify-center text-size-24
						group-hover:underline
						${media ? "text-background" : "text-foreground"}`}>
						View
					</Link>
				</div>
			</div>

			</div>
	)
}
