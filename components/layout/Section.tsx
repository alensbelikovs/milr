import slugify from "@/utils/slugify"

// A page section; a label gives it an id for SectionNav
export default function Section(
	{ children, label, className = "" }: {
		children: React.ReactNode,
		label?: string,
		className?: string
	}) {
	return (
		<section
			id={label ? slugify(label) : undefined}
			className={`grid-standard ${className}`}>
			{children}
		</section>
	)
}
