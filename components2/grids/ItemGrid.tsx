// Used inside of sections. Do not apply px
import type { ProjectListType, DiaryListType } from "@/types/ContentTypes"
import ProjectItem from "@/components2/grids/ProjectItem"
import SocialFeedItem from "@/components2/grids/SocialFeedItem"

type ItemType = ProjectListType | DiaryListType

// Both list types carry a title, a slug and a mediaUrl — see ContentTypes — so _createdAt is the
// only field that tells them apart: the diary query asks for it by name because the feed orders and
// prints by it, and a project has no use for one.
//
// Written as "is this a diary entry", not "is this a project", and it has to be that way round. A
// diary entry has every field a project has and one more, so it is assignable to ProjectListType —
// a guard asserting `item is ProjectListType` would narrow the ELSE branch to never, having
// discarded both constituents as matches. Testing for the longer shape is what leaves a project in
// the branch where a project belongs.
const isDiaryEntry = (item: ItemType): item is DiaryListType => "_createdAt" in item

export default function ItemGrid(
	{ items }:
		{ items: ItemType[] })
{

	return (
		<div className="grid grid-cols-12 gap-x-size-24 gap-y-size-64 px-size-24 py-size-32">
			{
			items.map(item => (
					isDiaryEntry(item)
						? <SocialFeedItem key={item.slug} entry={item} />
						: <ProjectItem key={item.slug} project={item} />
				))
			}
		</div>
	)
}
