import Link from "next/link"
import PaginationPageLink from "@/components/common/PaginationPageLink"
import { projectsHref } from "@/utils/projectsUrl"

// Prev and Next are links when there is somewhere to go and plain text when there is not, because a
// link cannot be disabled. <a> has no disabled attribute; aria-disabled tells assistive tech the
// control is inert while the browser goes on following the href anyway, so the two disagree and the
// href wins. Not rendering an anchor is the only honest way to say "no previous page".
//
// The muted colour matches the rest of the inactive UI, so the dead end still reads as one.
function PaginationStep(
	{ label, href }:
	{ label: string, href: string | null }
) {
	const shared = "py-[12px] text-heading-2"

	if (!href) return <span className={`${shared} text-foreground/25`}>{label}</span>

	return (
		<Link
			href={href}
			scroll={false}
			className={`
				${shared} cursor-pointer
				hover:underline hover:underline-offset-4
				focus-visible:underline focus-visible:underline-offset-4
			`}
		>
			{label}
		</Link>
	)
}

// A server component: every bit of state it renders arrives as a prop, so there is nothing here that
// needs the browser. It was "use client" only because the numbers used to be hardcoded buttons.
//
// It takes a total rather than working one out — the page already counted the set it is slicing, and
// a second opinion here could disagree with the slice it is labelling.
export default function Pagination(
	{ currentPage, totalPages, category }:
	{ currentPage: number, totalPages: number, category: string | null }
) {
	// One page is not a pagination. Rendering a lone "1" with two dead steps beside it is furniture
	// for a control with nothing to control.
	if (totalPages <= 1) return null

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

	return (
		<nav
			aria-label="Pagination"
			className="col-span-6 col-start-9 flex flex-col gap-24"
		>
			<div className="flex">
				{pages.map(page => (
					<PaginationPageLink
						key={page}
						number={page}
						href={projectsHref({ category, page })}
						active={page === currentPage} />
				))}
			</div>
			<div className="flex justify-between">
				<PaginationStep
					label="Prev"
					href={currentPage > 1 ? projectsHref({ category, page: currentPage - 1 }) : null} />
				<PaginationStep
					label="Next"
					href={currentPage < totalPages ? projectsHref({ category, page: currentPage + 1 }) : null} />
			</div>
		</nav>
	)
}
