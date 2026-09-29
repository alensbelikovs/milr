import BodySpanSerif from "@/components/typography/BodySpanSerif"
import TextLineSplit from "@/components/animation/TextLineSplit"

// instant passes straight through: it is the caller who knows whether this copy is worth waiting
// for a line at a time, or is already on screen when the page arrives and should simply be there.
export default function Body36(
	{ children, serif, className = "", instant = false }:
		{ children: React.ReactNode; serif?: string; className?: string; instant?: boolean })
{
	return (
		<div className={className}>
			{/* The paragraph itself, rendered by the wrapper so it has an element to cut into lines.
			    The serif tag goes inside it rather than beside it, so it is carried by whichever line
			    it ends up on instead of standing still while the rest moves. */}
			<TextLineSplit className="text-size-36" instant={instant}>
				{children}
				{serif && <BodySpanSerif>{serif}</BodySpanSerif>}
			</TextLineSplit>
		</div>
	)
}
