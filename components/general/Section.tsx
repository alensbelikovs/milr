import slugify from "@/utils/slugify"

// The semantic <section> element for a page section, needed to appear in SectionNav.
export default function Section(
	{ label, children, className }: { label?: string; children?: React.ReactNode; className?: string }
) {
	return (
		<section
			id={label ? slugify(label) : undefined}
			className={`grid-standard py-size-144 ${className ?? ""}`}>
			{children}
		</section>
	)
}
