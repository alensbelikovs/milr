import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import PageReadySignal from "@/components/transition/PageReadySignal"
import ProjectsHeader from "@/components/projects-sections/ProjectsHeader"
import ProjectGrid from "@/components/common/ProjectGrid"
import ProjectGridShell from "@/components/common/ProjectGridShell"
import Pagination from "@/components/common/Pagination"
import { getCategories, getProjectsCount, getProjectsPage } from "@/utils/sanityGetters"
import { PROJECTS_PER_PAGE, categorySlug, projectsHref } from "@/utils/projectsUrl"
import type { CategoryListType } from "@/types/ContentTypes"

// A repeated key comes back as an array — ?category=a&category=b — and the first one is the answer.
// Reading it straight would hand an array to a string comparison that then silently never matches.
const first = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value[0] : value

// Everything the URL says, checked against what exists, in one place: both the page and
// generateMetadata need the same answers and neither should reach a different conclusion.
//
// The category list is a parameter rather than fetched in here because the page needs it whole for
// the chips — resolving a slug is one find() over a list it already has, not a second round trip.
//
// The count comes off the resolved category rather than from a filtered count query: the categories
// query already counted the projects referencing each one, and category is the only reference a
// project carries, so it is the same number by the same predicate.
function resolveProjects(
	categories: CategoryListType[],
	totalCount: number,
	params: { category?: string | string[], page?: string | string[] }
) {
	const categorySlugParam = first(params.category) ?? null
	const pageParam = first(params.page)

	const category = categorySlugParam
		? categories.find(entry => categorySlug(entry.title) === categorySlugParam) ?? null
		: null

	// A slug naming no category is a collection that does not exist, so it 404s rather than quietly
	// falling back to All. Falling back would serve the full grid under a URL that promises a filtered
	// one — a soft duplicate for a crawler, and a lie to anyone who followed a stale link.
	if (categorySlugParam && !category) notFound()

	// Anything that is not a whole number from 1 up was not built by projectsHref.
	const page = pageParam === undefined ? 1 : Number(pageParam)
	if (!Number.isInteger(page) || page < 1) notFound()

	const count = category ? category.count : totalCount

	// Floored at one, so an emptied category still has a page to land on. 404ing there would break a
	// chip the header itself offered, and an empty grid is the honest answer to "show me these".
	const totalPages = Math.max(1, Math.ceil(count / PROJECTS_PER_PAGE))
	if (page > totalPages) notFound()

	return { categorySlugParam, category, page, totalPages, pageParam }
}

export async function generateMetadata(
	{ searchParams }: PageProps<"/projects">
): Promise<Metadata> {
	const [categories, totalCount] = await Promise.all([getCategories(), getProjectsCount()])
	const { category, page, totalPages } = resolveProjects(categories, totalCount, await searchParams)

	// Distinct per state, which is the part of this that actually decides whether the filtered and
	// paged views can rank: identical titles across every page of a list is what gets the later ones
	// dropped as duplicates.
	const label = category ? `${category.title} Projects` : "All Projects"

	return {
		title: totalPages > 1 && page > 1 ? `${label} — Page ${page} of ${totalPages}` : label,
		description: category
			? `${category.title} work by MILR Studio.`
			: "Selected work by MILR Studio.",
	}
}

export default async function ProjectsIndexPage({ searchParams }: PageProps<"/projects">) {
	const params = await searchParams

	// Both are needed before anything can be decided — the chips and the slug resolution come out of
	// the category list, the All count out of the other — and neither depends on the other.
	const [categories, totalCount] = await Promise.all([getCategories(), getProjectsCount()])

	const { categorySlugParam, category, page, totalPages, pageParam } =
		resolveProjects(categories, totalCount, params)

	// ?page=1 is the same content as no page param at all, and two addresses for one page is a
	// duplicate to a crawler and a second router cache entry. Sent to the canonical one, after the
	// validation above so a bad category is not redirected into a URL that 404s anyway.
	if (pageParam !== undefined && page === 1) {
		redirect(projectsHref({ category: categorySlugParam }))
	}

	const start = (page - 1) * PROJECTS_PER_PAGE
	const projects = await getProjectsPage({
		categoryId: category?._id ?? null,
		start,
		end: start + PROJECTS_PER_PAGE,
	})

	return (
		<>
			<ProjectsHeader
				categories={categories}
				activeSlug={categorySlugParam}
				totalCount={totalCount} />

			<section className="px-regular bg-background relative z-1">
				{/* Keyed on the state it is showing, which is what makes a filter change tear the grid
				    down and build a new one. ScrollReveal only animates on a fresh mount — see
				    ProjectGridShell — so reconciling in place would swap the cards in with no entrance. */}
				<ProjectGridShell key={`${categorySlugParam ?? "all"}-${page}`}>
					<ProjectGrid items={projects} />
				</ProjectGridShell>

				<div className="grid grid-cols-15 gap-x-regular">
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						category={categorySlugParam} />
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
