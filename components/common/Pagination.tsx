import Link from "next/link"
import PaginationPage from "@/components/common/PaginationPage"

const STEP = "py-[12px] text-heading-2 text-left"

const STEP_INTERACTIVE = `
	cursor-pointer
	hover:underline hover:underline-offset-4
	focus-visible:underline focus-visible:underline-offset-4
`

// Prev and Next, and the one place the two modes genuinely differ in MARKUP rather than in meaning.
//
// A link cannot be disabled. <a> has no disabled attribute; aria-disabled tells assistive tech the
// control is inert while the browser goes on following the href anyway, so the two disagree and the
// href wins. Not rendering an anchor is the only honest way to say "no previous page".
//
// A button can simply say it, so it does. Same dead end, same muted colour, told the way each element
// is able to tell it.
function PaginationStep(
	{ label, href, onSelect, disabled }:
	{ label: string, href?: string | null, onSelect?: () => void, disabled?: boolean }
) {
	if (onSelect) {
		return (
			<button
				type="button"
				onClick={onSelect}
				disabled={disabled}
				className={`
					${STEP} disabled:text-foreground/25
					enabled:cursor-pointer
					enabled:hover:underline enabled:hover:underline-offset-4
					enabled:focus-visible:underline enabled:focus-visible:underline-offset-4
				`}
			>
				{label}
			</button>
		)
	}

	if (!href) return <span className={`${STEP} text-foreground/25`}>{label}</span>

	return (
		<Link href={href} scroll={false} className={`${STEP} ${STEP_INTERACTIVE}`}>
			{label}
		</Link>
	)
}

// Numbers, Prev and Next, for anything with more than one of something to move between.
//
// Two modes, and the choice between them is the choice between a navigation and a selection.
// buildHref serves the paged lists: /projects hands it a builder that carries the active category
// along with the page, /diary one that has only a page to spend, and this serves both without knowing
// what either is paging. onSelect serves in-place state — the testimonials on the home page, where
// which quote is showing never reaches the URL. See PaginationPage for why that line is where it is.
//
// A union rather than two optional props, so a pagination that neither navigates nor selects cannot
// be built. Everything else — the numbers, the steps, the ends, the look — is shared, which is what
// keeps the two from drifting into different controls that happen to resemble each other.
//
// No "use client": handed buildHref by a server page it stays on the server, and pulled in by
// Testimonials with an onSelect it compiles into the client graph alongside it. Passing a function
// crosses no boundary either way, because both ends live on the same side of it.
//
// It takes a total rather than working one out — the page already counted the set it is slicing, and
// a second opinion here could disagree with the slice it is labelling.
//
// className positions the nav and nothing else. It renders no box of its own around it: the list
// pages put it in their own twelve-column row, and Testimonials places it beside the portrait in the
// section grid it is already part of. A wrapper here would have to guess which.
type PaginationProps = {
	currentPage: number,
	totalPages: number,
	label?: string,
	className?: string
} & (
	| { buildHref: (page: number) => string, onSelect?: never }
	| { onSelect: (page: number) => void, buildHref?: never }
)

const DEFAULT_CLASS = "col-start-7 col-span-5 flex flex-col gap-normal-3 pb-normal-3"

export default function Pagination(props: PaginationProps) {
	const { currentPage, totalPages, label = "Pagination", className = DEFAULT_CLASS } = props

	// One page is not a pagination. Rendering a lone "1" with two dead steps beside it is furniture
	// for a control with nothing to control — which is exactly the shape a project show page hands
	// Testimonials, where there is a single quote and nothing to move between.
	if (totalPages <= 1) return null

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

	// Read off props rather than destructured, because destructuring the union loses the narrowing
	// that makes buildHref and onSelect exclusive.
	const linked = props.buildHref !== undefined

	return (
		<nav aria-label={label} className={className}>
			<div className="flex">
				{pages.map(page => (
					linked
						? <PaginationPage
							key={page}
							number={page}
							href={props.buildHref!(page)}
							active={page === currentPage} />
						: <PaginationPage
							key={page}
							number={page}
							onSelect={() => props.onSelect!(page)}
							active={page === currentPage} />
				))}
			</div>
			<div className="flex justify-between">
				{linked
					? <PaginationStep
						label="Prev"
						href={currentPage > 1 ? props.buildHref!(currentPage - 1) : null} />
					: <PaginationStep
						label="Prev"
						onSelect={() => props.onSelect!(currentPage - 1)}
						disabled={currentPage <= 1} />}
				{linked
					? <PaginationStep
						label="Next"
						href={currentPage < totalPages ? props.buildHref!(currentPage + 1) : null} />
					: <PaginationStep
						label="Next"
						onSelect={() => props.onSelect!(currentPage + 1)}
						disabled={currentPage >= totalPages} />}
			</div>
		</nav>
	)
}
