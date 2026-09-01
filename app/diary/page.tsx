import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import PageReadySignal from "@/components/transition/PageReadySignal"
import DiaryHeader from "@/components/diary-sections/DiaryHeader"
import VideoBlogGridWrapper from "@/components/common/VideoBlogGridWrapper"
import ListRouteShell from "@/components/common/ListRouteShell"
import Pagination from "@/components/common/Pagination"
import { GRID_CONTAINER, GRID_CYCLE_SPACER, PROJECT_VARIANTS } from "@/utils/gridVariants"
import { getVideoBlogsCount, getVideoBlogsPage } from "@/utils/sanityGetters"
import { VIDEO_BLOGS_PER_PAGE, diaryHref } from "@/utils/diaryUrl"
import { first } from "@/utils/firstParam"

// Everything the URL says, checked against what exists, in one place: both the page and
// generateMetadata need the same answers and neither should reach a different conclusion.
//
// Shorter than the projects page's equivalent by exactly one dimension. There is no category to
// resolve, no slug to fail to match, and so no category list to resolve it against — a videoBlog
// references nothing, so the page number is the whole of this route's state.
function resolveDiary(
	totalCount: number,
	params: { page?: string | string[] }
) {
	const pageParam = first(params.page)

	// Anything that is not a whole number from 1 up was not built by diaryHref.
	const page = pageParam === undefined ? 1 : Number(pageParam)
	if (!Number.isInteger(page) || page < 1) notFound()

	// Floored at one, so an empty diary still has a page to land on. 404ing there would break the link
	// the navbar and the home section both offer, and an empty grid is the honest answer to "show me
	// these".
	const totalPages = Math.max(1, Math.ceil(totalCount / VIDEO_BLOGS_PER_PAGE))
	if (page > totalPages) notFound()

	return { page, totalPages, pageParam }
}

export async function generateMetadata(
	{ searchParams }: PageProps<"/diary">
): Promise<Metadata> {
	const totalCount = await getVideoBlogsCount()
	const { page, totalPages } = resolveDiary(totalCount, await searchParams)

	// Distinct per page, which is the part of this that actually decides whether the later pages can
	// rank: identical titles across every page of a list is what gets them dropped as duplicates.
	const label = "My Design Diary"

	return {
		title: totalPages > 1 && page > 1 ? `${label} — Page ${page} of ${totalPages}` : label,
		description: "Process notes and video diary entries by MILR Studio.",
	}
}

export default async function DiaryIndexPage({ searchParams }: PageProps<"/diary">) {
	const params = await searchParams

	// One await rather than the projects page's Promise.all: with no chips to build there is no
	// category list to fetch alongside the count, and the count is all that decides the paging.
	const totalCount = await getVideoBlogsCount()

	const { page, totalPages, pageParam } = resolveDiary(totalCount, params)

	// ?page=1 is the same content as no page param at all, and two addresses for one page is a
	// duplicate to a crawler and a second router cache entry. Sent to the canonical one, after the
	// validation above so a bad page number is not redirected into a URL that 404s anyway.
	if (pageParam !== undefined && page === 1) {
		redirect(diaryHref())
	}

	const start = (page - 1) * VIDEO_BLOGS_PER_PAGE
	const blogs = await getVideoBlogsPage({
		start,
		end: start + VIDEO_BLOGS_PER_PAGE,
	})

	return (
		<>
			<DiaryHeader totalCount={totalCount} />

			<section className="px-regular bg-background relative z-1">
				{/* Keyed on the page it is showing, which is what makes paging tear the grid down and
				    build a new one. ScrollReveal only animates on a fresh mount — see ListRouteShell — so
				    reconciling in place would swap the cards in with no entrance. It takes the wrapper
				    down with them, and its player state with it: the blog being watched is not on the
				    page that just arrived. */}
				<ListRouteShell key={page}>
					<VideoBlogGridWrapper
						items={blogs}
						variants={PROJECT_VARIANTS}
						className={GRID_CONTAINER}
						cycleSpacer={GRID_CYCLE_SPACER} />
				</ListRouteShell>

				{/* The twelve-column row the nav positions itself in. Pagination renders no box of its
				    own — see that file — so the grid it lands in is the caller's to provide, the same
				    way /projects provides one. */}
				<div className="grid grid-cols-12 gap-x-regular">
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						buildHref={page => diaryHref({ page })} />
				</div>
			</section>

			{/* Last, and outside any Suspense boundary on purpose. It signals on mount, and for an async
			    page that mount only happens once the awaits above resolved — which is exactly the
			    contract TransitionControl waits on. Streaming the grid behind a fallback would commit
			    this early and lift the curtain on an empty page. */}
			<PageReadySignal />
		</>
	)
}
