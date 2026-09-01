
import BodySmallP from "@/components2/typography/BodySmallP"

// Gutter and side padding stay with the layout, as in BodyPrimary: forceSpacing sets how this sits
// among its neighbours, and dropping the grid's own rhythm is never what that means.
const LAYOUT_CLASS_NAME = "w-full grid grid-cols-12 gap-size-24 px-size-24"
const DEFAULT_SPACING_CLASS_NAME = ""

type BodySmallPElement = React.ReactElement<
	React.ComponentProps<typeof BodySmallP>,
	typeof BodySmallP
>

export default function BodySmallPContainer(
	{ children, forceSpacing }:
		{ children: BodySmallPElement | BodySmallPElement[]; forceSpacing?: string })
{
	return (
		<div className={`${LAYOUT_CLASS_NAME} ${forceSpacing ?? DEFAULT_SPACING_CLASS_NAME}`}>
			{/* The gap between the paragraphs themselves is this column's, not the section's, so
			    forceSpacing leaves it alone. */}
			<div className="col-start-7 col-span-3 flex flex-col gap-size-48">
				{ children }
			</div>
		</div>
	)
}
