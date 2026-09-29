import HeadingSpanSerif from "@/components/typography/HeadingSpanSerif"
import TextLineSplit from "@/components/animation/TextLineSplit"

// instant passes straight through: it is the caller who knows whether this heading is worth waiting
// for a line at a time, or is already on screen when the page arrives and should simply be there.
export default function Heading72(
	{ children, serif, className = "", instant = false }:
		{ children: React.ReactNode; serif?: string; className?: string; instant?: boolean })
{
	return (
		<div className={`
			col-start-1 col-span-full
			md:col-start-2 md:col-span-10
			${className}`}>
			{/* The serif tag goes inside the heading rather than beside it, so it is carried by
			    whichever line it ends up on instead of standing still while the rest moves. */}
			<TextLineSplit as="h3" className="text-size-96" instant={instant}>
				{children}
				{serif && <HeadingSpanSerif>{serif}</HeadingSpanSerif>}
			</TextLineSplit>
		</div>
	)
}
