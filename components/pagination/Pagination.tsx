import Link from "next/link"
import PaginationStepButton from "@/components/pagination/PaginationStepButton"

// Numbers, Prev and Next for a paged list.
//
// buildHref rather than a route: /work hands it a builder that carries the active filters along with
// the page, and this serves any list without knowing what it is paging. Passing a function is fine —
// this stays a server component, so nothing crosses a client boundary.
//
// It takes a total rather than working one out — the page already counted the set it is slicing, and
// a second opinion here could disagree with the slice it is labelling.
export default function Pagination(
	{ currentPage, totalPages, buildHref }:
	{ currentPage: number, totalPages: number, buildHref: (page: number) => string }
) {
	// One page is not a pagination: a lone "1" between two dead steps is a control with nothing to
	// control.
	if (totalPages <= 1) return null

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

	return (
		<nav aria-label="Pagination" className="col-start-5 col-span-4 flex flex-col justify-center gap-size-24">
			<div className="flex items-center w-full justify-center">
				{pages.map(page => (
					<PaginationStepButton
						key={page}
						step={page}
						href={buildHref(page)}
						active={page === currentPage} />
				))}
			</div>
			<div className="w-full flex justify-between gap-size-48">
				<PaginationFlipButton href={currentPage > 1 ? buildHref(currentPage - 1) : null}>
					Prev
				</PaginationFlipButton>
				<PaginationFlipButton href={currentPage < totalPages ? buildHref(currentPage + 1) : null}>
					Next
				</PaginationFlipButton>
			</div>
		</nav>
	)
}

// A link cannot be disabled — <a> has no disabled attribute, and aria-disabled leaves the browser
// following the href anyway. Not rendering an anchor is the only honest way to say "no next page".
const PaginationFlipButton = (
	{ href, children }:
	{ href: string | null, children: React.ReactNode }
) => {
	if (!href) return <span className="text-size-36 text-current/25">{children}</span>

	return (
		<Link href={href} scroll={false} className="text-size-36 hover:underline cursor-pointer">
			{children}
		</Link>
	)
}
