import TextLineReveal from "@/components2/typography/TextLineReveal"

// The gutter and the side padding stay with the layout even though they are spacing: every section
// sits in the same 12-column rhythm, and a caller reaching for forceSpacing is saying where this
// sits among its neighbours, not asking to leave the grid. So only the block spacing is swappable —
// otherwise every override would have to respell px-size-24 and gap-size-24 to avoid losing them.
const LAYOUT_CLASS_NAME = "w-full grid grid-cols-12 gap-size-24 px-size-24"
const DEFAULT_SPACING_CLASS_NAME = "py-size-128"

export default function BodyPrimary(
	{ children, forceSpacing }:
		{ children: React.ReactNode; forceSpacing?: string })
{
	return (
		<div className={`${LAYOUT_CLASS_NAME} ${forceSpacing ?? DEFAULT_SPACING_CLASS_NAME}`}>
			<div className="col-start-2 col-span-5">
				<TextLineReveal className="text-size-36">{children}</TextLineReveal>
			</div>
		</div>
	)
}
