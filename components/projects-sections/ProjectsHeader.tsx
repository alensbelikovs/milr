import Link from "next/link"
import SerifNumSpan from "@/components/common/SerifNumSpan"
import ProjectsHeaderCategory from "@/components/projects-sections/ProjectsHeaderCategory"
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
		"
		>
			<div className="col-start-2 col-span-6">
				<h1 className="text-heading-4">
					{/* Still a link when it is the selected one, unlike the current page number in
					    Pagination, which renders as a span. The difference is what the control means: a
					    page number is a position, and a self-link to where you already are is a tab stop
					    that does nothing, while a category is an option that stays an option once picked.
					    Keeping it an anchor also keeps the heading clickable at all times, so the hit area
					    and the layout do not shift as the filter changes. */}
					<Link
						href={projectsHref({ category: null })}
						aria-current={allActive ? "page" : undefined}
						className={`
							hover:text-foreground hover:underline hover:underline-offset-4
							focus-visible:text-foreground
							focus-visible:underline focus-visible:underline-offset-4
							${allActive ? "text-foreground" : "text-foreground/50"}
						`}
					>
						All Work<SerifNumSpan sizeClass="text-subheading">{totalCount}</SerifNumSpan>
					</Link>
				</h1>
			</div>

			{/* A landmark, so the filters are one named thing to skip past rather than links loose in a
			    heading block. The All Work link is deliberately outside it: it is the page's h1, and the
			    page title does not belong inside a navigation landmark. */}
			<nav
				aria-label="Filter projects by category"
				className="col-start-8 col-span-5 flex flex-wrap items-end gap-regular pb-small"
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
