import SectionTitle from "@/components2/typography/SectionTitle"
import BodyPrimary from "@/components2/typography/BodyPrimary"
import SectionEnd from "@/components2/typography/SectionEnd"
import ItemGrid from "@/components2/grids/ItemGrid"
import BodyLink from "@/components2/actions/BodyLink"
import SerifSpan from "@/components2/typography/SerifSpan"

// Temporary
import type { DiaryListType } from "@/types/ContentTypes"

// Fixed dates rather than anything relative to now: these are rendered on the server and again in
// the browser, and a stamp that moves between the two is a hydration mismatch.
const posts: DiaryListType[] = [
	{
		title: "Three questions I ask before drawing anything",
		slug: "three-questions",
		_createdAt: new Date("2026-08-14T09:00:00Z"),
		mediaUrl: null,
	},
	{
		title: "Why the hallway is the room worth fighting for",
		slug: "the-hallway",
		_createdAt: new Date("2026-07-30T09:00:00Z"),
		mediaUrl: null,
	},
	{
		title: "Choosing a floor you will still like in ten years",
		slug: "choosing-a-floor",
		_createdAt: new Date("2026-07-11T09:00:00Z"),
		mediaUrl: null,
	},
	{
		title: "Light does more of the work than colour does",
		slug: "light-over-colour",
		_createdAt: new Date("2026-06-28T09:00:00Z"),
		mediaUrl: null,
	},
]

export default function FeaturedDiary() {
	return (
		<section>
			<SectionTitle chapter="5" title="Social Feed" />
			<BodyPrimary forceSpacing="pt-size-96 pb-size-32">
				Latest Thoughts <SerifSpan size="16">4</SerifSpan>
			</BodyPrimary>
			<ItemGrid items={posts} />
			<SectionEnd link={<BodyLink href="/diary">See More Posts</BodyLink>}>
				A mix of practical tips and creative ideas, Taken from my social media feeds.
			</SectionEnd>
		</section>
	)
}
