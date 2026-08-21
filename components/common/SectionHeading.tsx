import SerifNumSpan from "@/components/common/SerifNumSpan"

export default function SectionHeading(
	{ className, sizeClassSerif, children, num }:
	{ className?: string, sizeClassSerif: string, children: React.ReactNode, num: string }
) {
	return (
		<h2 className={`flex gap-small ${className} text-heading-2`}>
			<span>{children}</span>
			<SerifNumSpan sizeClass={sizeClassSerif}>{num}</SerifNumSpan>
		</h2>
	)
}