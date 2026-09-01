import FadeReveal from "@/components2/animation/FadeReveal"

const TYPE_CLASS_NAME = "text-size-18 font-serif"

export default function BodySmallP(
	{ children, forceSpacing }:
		{ children: React.ReactNode; forceSpacing?: string })
{
	// Nothing to replace: a paragraph carries no spacing of its own, because the gap between one and
	// the next belongs to BodySmallPContainer. So forceSpacing adds spacing here rather than
	// swapping it, for the caller that wants one paragraph to sit apart from the rest.
	const className = `${TYPE_CLASS_NAME} ${forceSpacing ?? ""}`.trim()

	return (
		<FadeReveal as="p" className={className} translateY="20vh">
			{children}
		</FadeReveal>
	)
}
