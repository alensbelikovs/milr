
import { type ProjectListType } from "@/types/ContentTypes"
import Link from "next/link"
import Image from "next/image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"

export default function ProjectCard({ project }: { project: ProjectListType }) {
	const { title, media, slug, type, category } = project

	return (
		<div className="col-span-1 relative group">
			<Link className="absolute inset-0 z-1" href={`/projects/${slug}`} />
			<div className="bg-image-placeholder aspect-4/3 relative overflow-hidden">
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
			<div className="flex flex-row gap-size-48 mt-size-16 justify-between items-center">
				<h3 className="text-size-16 group-hover:underline col-span-2">{title}</h3>
				<p className="text-foreground/50 col-span-3">
					{category} {type}
				</p>
			</div>

		</div>
	)
}
