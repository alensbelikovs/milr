import SectionHeading from "@/components/common/SectionHeading"
import VideoBlogGridSmall from "@/components/common/VideoBlogGridSmall"
import { getVideoBlogs, getVideoBlogsCount } from "@/utils/sanityGetters"
import LinkSecondary from "@/components/common/LinkSecondary"

// How many video blogs the home grid features. One full row of the small grid, whose cards are four
// columns wide on twelve — a fourth would wrap to a row of its own.
const FEATURED_LIMIT = 3

// The limit with a "+" while there is more to watch than the grid holds, the plain total once there
// is not. The blogs array stops at the limit, so it cannot tell four blogs from forty.
const formatCount = (total: number) => total > FEATURED_LIMIT ? `${FEATURED_LIMIT}+` : `${total}`

export default async function HomeFeaturedBlogs() {
	const [blogs, total] = await Promise.all([
		getVideoBlogs(FEATURED_LIMIT),
		getVideoBlogsCount(),
	])

	if (blogs.length === 0) return null

	return (
		<section className="pt-section px-regular bg-background relative z-1">
			<div className="grid grid-cols-15 gap-x-regular">
				<div className="col-span-full md:col-start-2 md:col-span-13">
					<SectionHeading sizeClassSerif="text-body-3" num={formatCount(total)}>My Design Diary</SectionHeading>
				</div>
			</div>
			<VideoBlogGridSmall items={blogs} />
			<div className="flex items-center justify-center w-full col-span-full">
				<LinkSecondary href="/video-blog" target="_self">See More</LinkSecondary>
			</div>
		</section>
	)
}
