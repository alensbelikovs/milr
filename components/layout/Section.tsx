// A page section; a navId gives it an id for SectionNav, and names its label in dict.sections.
// noTopPadding / noBottomPadding drop that side's padding, where the section meets a neighbour flush.
export default function Section(
	{ children, navId, noTopPadding = false, noBottomPadding = false, className = "" }: {
		children: React.ReactNode,
		navId?: string,
		noTopPadding?: boolean,
		noBottomPadding?: boolean,
		className?: string
	}) {
	return (
		<section
			id={navId}
			className={`
				grid-standard
				${noTopPadding ? "" : "pt-size-144"}
				${noBottomPadding ? "" : "pb-size-144"}
				${className}
			`}>
			{children}
		</section>
	)
}
