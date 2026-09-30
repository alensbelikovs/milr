import { Fragment } from "react"
import { notFound, redirect } from "next/navigation"
import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroCommonList from "@/components/sections/HeroCommonList"
import FilterNav from "@/components/navigation/FilterNav"
import WorkGrid from "@/components/cards/WorkGrid"
import ProudestWork from "@/components/sections/ProudestWork"
import Pagination from "@/components/pagination/Pagination"
import {
	getWorkCategories,
	getWorkCount,
	getWorkIndex,
	getWorkTypes,
	type WorkFilter,
} from "@/utils/sanityGetters"
import { WORK_GRID_LIMIT, WORK_PER_PAGE, workHref } from "@/utils/workUrl"
import { first } from "@/utils/firstParam"
import { type WorkCategory, type WorkType } from "@/types/ContentTypes"
import MainNav from "@/components/navigation/MainNav"

// Everything the URL says, checked against what exists, in one place.
//
// The filter lists are parameters rather than fetched in here because the page needs them whole for
// the nav — resolving a slug is one find() over a list it already has, not a second round trip.
function resolveFilter(
	categories: WorkCategory[],
	types: WorkType[],
	params: { category?: string | string[], type?: string | string[], page?: string | string[] }
) {
	const categoryParam = first(params.category) ?? null
	const typeParam = first(params.type) ?? null
	const pageParam = first(params.page)

	// A slug naming no filter is a collection that does not exist, so it 404s rather than quietly
	// falling back to All. Falling back would serve the full grid under a URL that promises a filtered
	// one — a soft duplicate for a crawler, and a lie to anyone who followed a stale link.
	if (categoryParam && !categories.some(category => category.slug === categoryParam)) notFound()
	if (typeParam && !types.some(type => type.slug === typeParam)) notFound()

	// Anything that is not a whole number from 1 up was not built by workHref.
	const page = pageParam === undefined ? 1 : Number(pageParam)
	if (!Number.isInteger(page) || page < 1) notFound()

	const filter: WorkFilter = { category: categoryParam, type: typeParam }

	return { filter, page, pageParam }
}

export default async function WorkPage({ searchParams }: PageProps<"/work">) {
	const params = await searchParams

	// None of these depends on another, and everything below needs the first two before it can decide
	// anything. The total is the heading's number — the whole collection, whatever is filtered.
	const [categories, types, totalCount] = await Promise.all([
		getWorkCategories(),
		getWorkTypes(),
		getWorkCount(),
	])

	const { filter, page, pageParam } = resolveFilter(categories, types, params)

	// ?page=1 is the same content as no page param at all, and two addresses for one page is a
	// duplicate to a crawler and a second router cache entry. Sent to the canonical one, after the
	// validation above so a bad filter is not redirected into a URL that 404s anyway.
	if (pageParam !== undefined && page === 1) redirect(workHref(filter))

	const start = (page - 1) * WORK_PER_PAGE

	// Asked for here rather than above because it is asked for under the filter, and the filter is not
	// settled until the categories and types have come back to validate it.
	//
	// The count is the grid's, not the heading's: the featured piece is left out of the grid on every
	// page, so it is one short of totalCount even unfiltered. The band comes back null whenever the
	// piece it features falls outside the filter, so whether it belongs is the query's job rather than
	// this page's.
	const { work, count, proudestWork } =
		await getWorkIndex({ ...filter, start, end: start + WORK_PER_PAGE })

	// Floored at one, so a filter combination with nothing in it still has a page to land on. The nav
	// offers every category against every type, and an empty grid is the honest answer to a pair
	// that happens to match nothing.
	const totalPages = Math.max(1, Math.ceil(count / WORK_PER_PAGE))
	if (page > totalPages) notFound()

	const firstGrid = work.slice(0, WORK_GRID_LIMIT)
	const secondGrid = work.slice(WORK_GRID_LIMIT)

	// Read twice below — once to place the band, once to decide whether the second grid needs the gap
	// the band would otherwise have given it — so the question is asked by name rather than twice over.
	// First page only: the piece is out of every page's grid, and the band on page one is where it lives.
	const showProudestWork = page === 1 && proudestWork !== null

	return (
		<>
			<MainNav color="text-foreground" />
			<HeroCommonList heading="Work" count={totalCount} />
			<FilterNav
				categories={categories}
				types={types}
				activeCategory={filter.category}
				activeType={filter.type} />
			{/* Keyed on the state it is showing, which is what makes a filter or page change tear the
			    results down and mount them fresh. Same route, same element types, so without it React
			    reconciles in place: every card's ScrollReveal is once and already spent, so the new set
			    would arrive with no entrance — and PageReadySignal, which fires once on mount, would
			    never tell TransitionControl the new results are in, leaving the curtain on its
			    failsafe. */}
			<Fragment key={workHref({ ...filter, page })}>
				<section className="">
					<div className="grid-standard">
						<WorkGrid work={firstGrid} />
					</div>
					{showProudestWork && <ProudestWork work={proudestWork} />}
					{/* Without the band between them the two grids would sit flush, so the gap the
					    rows inside a grid keep is restated between the grids. */}
					{
						secondGrid.length > 0 &&
						<div className={`grid-standard ${showProudestWork ? "" : "mt-size-64"}`}>
							<WorkGrid work={secondGrid} />
						</div>
					}
				</section>
				<div className="grid-standard mt-size-192">
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						buildHref={page => workHref({ ...filter, page })} />
				</div>
				{/* Last, and outside any Suspense boundary on purpose. It signals on mount, and for an
				    async page that mount only happens once the awaits above resolved — which is exactly
				    the contract TransitionControl waits on. */}
				<PageReadySignal />
			</Fragment>
		</>
	)
}
