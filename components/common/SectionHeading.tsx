import SerifNumSpan from "@/components/common/SerifNumSpan"

// The number lives in the heading's own text flow rather than in a second column, so it trails the
// last word instead of parking at the end of the row once the heading wraps. Nothing separates the
// two in the markup on purpose: the number carries its own left margin, and a space here would both
// add to that gap and give the browser a spot to break the number onto a line by itself.
export default function SectionHeading(
	{ className, sizeClassSerif, children, num }:
	{ className?: string, sizeClassSerif: string, children: React.ReactNode, num: string }
) {
	return (
		<h2 className={`${className} text-heading-2`}>
			{children}<SerifNumSpan sizeClass={sizeClassSerif}>{num}</SerifNumSpan>
		</h2>
	)
}
