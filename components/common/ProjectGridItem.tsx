import type { ProjectListType } from "@/types/ContentTypes"

export default function ProjectGridItem(
	{ project }:
	{ project?: ProjectListType }
) {

	return (
		<div className="col-span-3">
			{/* The dot field behind a card: /pattern.svg tiled edge to edge at its own 12px size. The
			    colour (#0015FF, the accent) is baked into the asset — a background-image cannot inherit
			    currentColor, so re-tinting this means another file, not a class. */}
			<div className="w-full aspect-3/4 bg-[url(/pattern.svg)] bg-repeat bg-size-[12px_12px]" />
		</div>
	)
}
