import Link from "next/link"
import PaginationStepButton from "@/components/pagination/PaginationStepButton"
import withSearchParams from "@/utils/withSearchParams"

// Numbers, Prev and Next for a paged list.
//
// Handed the page's own path and searchParams, and sets page on top of them — so whatever else the
// list is showing (the filters on /work, nothing on /diary) rides along without this knowing what it
// is paging. Page 1 is no param at all rather than ?page=1, so the first page keeps one address.
//
// It takes a total rather than working one out — the page already counted the set it is slicing, and
// a second opinion here could disagree with the slice it is labelling.
export default function Pagination(
	{ currentPage, totalPages, pathname, searchParams }:
	{
		currentPage: number
		totalPages: number
		pathname: string
		searchParams: Record<string, string | string[] | undefined>
	}
) {
	// One page is not a pagination: a lone "1" between two dead steps is a control with nothing to
	// control.
	if (totalPages <= 1) return null

	const buildHref = (page: number) =>
		withSearchParams(pathname, { ...searchParams, page: page > 1 ? page : null })

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
