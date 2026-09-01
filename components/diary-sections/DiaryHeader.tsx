import SerifNumSpan from "@/components/common/SerifNumSpan"

// The heading names the COLLECTION, and on this route that is all it could name: a videoBlog carries
// no reference to anything — see SCHEMAS.md — so there is no filter to pick, no chips to sit beside
// it, and nothing about the page for a query param to rename. ProjectsHeader spends a paragraph
// justifying why its h1 stays "All Work" whatever is selected; here the question never arises.
//
// Plain text rather than a link, which is where this parts company with ProjectsHeader. There the h1
// is a real control — the way back to unfiltered — so it earns its href. With no filter to clear, an
// href here could only point at the page it is already on: a navigation that does nothing, and a stop
// on the way through for anyone tabbing the page. Same reason PaginationPage renders the current
// page as a span rather than a link to itself.
//
// Paging leaves it alone too. The count is the size of the whole diary rather than of the page being
// shown, so it reads the same on page three as on page one — which is the honest number for a
// heading that names the collection.
export default function DiaryHeader({ totalCount }: { totalCount: number }) {
	return (
		<div className="
			py-section gap-regular px-regular
			relative z-1 bg-background
			grid grid-cols-12
			md:gap-y-0 gap-y-normal-2
		"
		>
			<div className="md:col-start-2 md:col-span-10 col-start-1 col-span-full">
				<h1 className="text-heading-4">
					Design Diary<SerifNumSpan sizeClass="text-subheading">{totalCount}</SerifNumSpan>
				</h1>
			</div>
		</div>
	)
}
