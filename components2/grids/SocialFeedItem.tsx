import type { DiaryListType } from "@/types/ContentTypes"
import PlaceholderPattern from "@/components2/common/PlaceholderPattern"
import formatDate from "@/utils/formatDate"

export default function SocialFeedItem(
	{ entry }:
	{ entry?: DiaryListType }
) {

	// _createdAt is the field the diary query projects — see DiaryListType — and formatDate wants a
	// date rather than a maybe, so the absence is handled here instead of inside it.
	const formattedDate = entry ? formatDate(entry._createdAt) : undefined

	return (
		<div className="col-span-3 flex flex-col gap-size-16">
			<div className="relative overflow-hidden aspect-3/4">
				<PlaceholderPattern />
			</div>
			<div className="w-full grid grid-cols-3 gap-size-16">
				<p className="text-size-12 col-span-3">{formattedDate ?? "Posted recently"}</p>
				<p className="text-size-24 col-span-2">{entry?.title ?? "Untitled post"}</p>
			</div>
		</div>
	)
}
