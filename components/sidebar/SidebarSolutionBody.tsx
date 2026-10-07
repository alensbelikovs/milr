import ScrollReveal from "@/components/animation/ScrollReveal"
import TextLineSplit from "@/components/animation/TextLineSplit"
import Image from "@/components/media/Image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import { type Solution } from "@/types/CommonTypes"

// A solution's title and description, with its picture pinned to the bottom of the panel
export default function SidebarSolutionBody({ solution }: { solution: Solution }) {
	const { title, description, img } = solution

	// overflow-clip so the rising picture doesn't make the panel scroll
	return (
		<div className="
			grid grid-cols-6 grid-rows-[auto_1fr] min-h-full overflow-clip
			px-size-24 gap-x-size-24 gap-y-size-96 pt-size-96 pb-size-24
		">
			<div className="col-start-2 col-span-4 flex flex-col">
				<h5 className="font-serif text-size-18 opacity-50">{title}</h5>
				<TextLineSplit onMount className="text-size-24 mt-size-48">
					{description}
				</TextLineSplit>
			</div>
			<div className="
				col-span-full self-end w-full
				relative overflow-hidden aspect-16/10
				bg-image-placeholder
			">
				<ScrollReveal onMount delay={0.05} />
				{
					img &&
					<Image
						src={buildImageUrl(img.src, CARD)}
						alt={img.alt ?? title}
						fill
						sizes="50vw"
						quality={99}
						className="object-cover" />
				}
			</div>
		</div>
	)
}
