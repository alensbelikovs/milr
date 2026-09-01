"use client"

import Link from "next/link"
import SerifNumSpan from "@/components/common/SerifNumSpan"
import ProjectsHeaderCategory from "@/components/project-index-sections/ProjectsHeaderCategory"
import type { CategoryListType } from "@/types/ContentTypes"
import { categorySlug, projectsHref } from "@/utils/projectsUrl"

// The heading names the COLLECTION, not the current filter, which is why it says All Work whatever is
// selected. That is the honest reading of it: the route is still /projects, the body of work is still
// all of it, and a category is a view onto that rather than a different page. Swapping the h1 to the
// active category would make the page's one heading a moving target — the thing a screen reader
// lands on to answer "what is this page" would answer differently depending on a query param.
//
// It is a link as well as a heading, and both claims are true at once: <a> is phrasing content and
// <h1> takes phrasing content, so this is ordinary HTML rather than a trick. Which one is selected
// is carried by aria-current and by opacity, not by which element the label sits in.
//
// Categories with nothing in them are dropped: a chip whose only destination is an empty grid is a
// dead end. Reaching one by URL still works and still renders — see the page's page-count floor.
//
// A client component, and only for the click guard below. Everything else here would happily run on
// the server: the props arrive already resolved from the page, the mapping is two entries long, and
// categorySlug and projectsHref are pure string functions. ProjectsHeaderCategory is a client
// component for the same reason, so the marginal cost of this one is the mapping and SerifNumSpan.
//
// The guard could have been CSS — pointer-events-none on the selected link — and that would have
// cost no JavaScript at all. It is not, because it only stops the pointer: the link stays tabbable
// and Enter still navigates, so the heading would answer the keyboard differently from the chips
// beside it, which block both.
export default function ProjectsHeader(
	{ categories, activeSlug, totalCount }:
	{ categories: CategoryListType[], activeSlug: string | null, totalCount: number }
) {
	const options = categories
		.filter(category => category.count > 0)
		.map(category => ({
			title: category.title,
			slug: categorySlug(category.title),
			count: category.count,
		}))

	const allActive = activeSlug === null

	return (
		<div className="
			py-section gap-regular px-regular
			relative z-1 bg-background
			grid grid-cols-12
			xl:gap-y-0
			gap-y-normal-3
		"
		>
			<div className="xl:col-start-2 xl:col-span-6 col-start-1 lg:col-span-10 lg:col-start-2 col-span-full">
				<h1 className="text-heading-4">
					<Link
						href={projectsHref({ category: null })}
						aria-current={allActive ? "page" : undefined}
						// Clicking All Work while All Work is what is showing is a navigation to the address
						// the page is already on. Left alone the router runs it, refetches the tree and hands
						// fresh children down, and TransitionControl — which sees new children and cannot tell
						// they render the same thing — spends the whole curtain sequence arriving back exactly
						// where it started.
						//
						// Written the same way round as the chips': the early return means preventDefault only
						// ever runs on the click that was going to change nothing, and every other click falls
						// through to the anchor untouched, prefetch and modifier clicks included.
						onClick={event => {
							if (!allActive) return
							event.preventDefault()
						}}
						className={`
							hover:underline hover:underline-offset-4
							focus-visible:text-foreground
							focus-visible:underline focus-visible:underline-offset-4
							${allActive ? "text-foreground" : "text-foreground/50"}
						`}
					>
						All Projects<SerifNumSpan sizeClass="text-subheading">{totalCount}</SerifNumSpan>
					</Link>
				</h1>
			</div>

			<nav
				aria-label="Filter projects by category"
				className="xl:col-start-8 xl:col-span-4 col-start-1 col-span-full lg:col-span-10 lg:col-start-2 flex flex-wrap items-end gap-regular pb-small"
			>
				{options.map(option => (
					<ProjectsHeaderCategory
						key={option.slug}
						title={option.title}
						count={option.count}
						href={projectsHref({ category: option.slug })}
						active={option.slug === activeSlug} />
				))}
			</nav>
		</div>
	)
}
