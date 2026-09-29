import { notFound, redirect } from "next/navigation"
import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroCommonList from "@/components/sections/HeroCommonList"
import PostGrid from "@/components/cards/PostGrid"
import Pagination from "@/components/pagination/Pagination"
import MainNav from "@/components/navigation/MainNav"
import { getPostsCount, getPostsPage } from "@/utils/sanityGetters"
import { POSTS_PER_PAGE, diaryHref } from "@/utils/diaryUrl"
import { first } from "@/utils/firstParam"

export default async function DiaryPage({ searchParams }: PageProps<"/diary">) {
	const params = await searchParams
	const pageParam = first(params.page)

	// Anything that is not a whole number from 1 up was not built by diaryHref.
	const page = pageParam === undefined ? 1 : Number(pageParam)
	if (!Number.isInteger(page) || page < 1) notFound()

	// ?page=1 is the same content as no page param at all, and two addresses for one page is a
	// duplicate to a crawler and a second router cache entry. Sent to the canonical one before
	// anything is fetched, so a redirect costs no round trips.
	if (pageParam !== undefined && page === 1) redirect(diaryHref())

	const start = (page - 1) * POSTS_PER_PAGE

	// The slice and the total together: the grid needs one, the heading and the pagination need the
	// other, and neither depends on the other. Serialised they would cost two round trips for a page
	// that can have them in one.
	const [posts, totalCount] = await Promise.all([
		getPostsPage({ start, end: start + POSTS_PER_PAGE }),
		getPostsCount(),
	])

	// Floored at one, so an empty diary still has a page to land on. 404ing there would break the link
	// the nav and the home section both offer, and an empty grid is the honest answer to "show me
	// these".
	const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE))
	if (page > totalPages) notFound()

	return (
		<>
			<MainNav color="text-foreground" />
			<HeroCommonList heading="Diary" count={totalCount} />
			{/* No grid where there is nothing to put in it — see the home page. The pagination goes with
			    it: one page of nothing is not a page anyone needs to be offered. */}
			{
				posts.length > 0 &&
				<>
					<section className="mb-size-192">
						<div className="grid-standard">
							<PostGrid posts={posts} />
						</div>
					</section>
					<div className="grid-standard mt-size-192 mb-size-192">
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							buildHref={page => diaryHref({ page })} />
					</div>
				</>
			}
			<PageReadySignal />
		</>
	)
}
