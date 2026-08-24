import Image from "next/image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import ScrollReveal from "@/components/common/ScrollReveal"
import type { VideoBlogType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"

// The intrinsic size handed to next/image, at the cover's own ratio. Only the ratio of the two
// matters — CSS sizes the rendered box — but it has to be the ratio aspect-3/4 lays out below, or
// the space the browser reserves before the stylesheet lands is the wrong shape and the grid jumps.
const COVER_WIDTH = CARD.width
const COVER_HEIGHT = Math.round(CARD.width * 4 / 3)

// A button, because there is nowhere for a link to go: the player opens as a dialog on this page and
// the URL never moves, so no address names this blog and an href could only promise one that does
// not resolve. The card reports that it was pressed; the grid decides what that means.
//
// The ratio belongs to the cover, and is set on the cover. Carried on the box above instead it
// measured the whole card — picture, date and title as one — so the picture was 3/4 less whatever
// the caption came to, and a title that wrapped to two lines took that second line out of the
// image. Here the image is 3/4 whatever else the card is carrying, and the caption rides below it.
//
// Which is why the clip is sized by the image rather than the image stretched to fill a sized clip:
// an element that owns its ratio cannot be position:absolute, and that is what fill makes it.
export default function VideoBlogGridItem(
	{ blog, className, delay, onOpen }:
	{ blog: VideoBlogType, className: string, delay?: number, onOpen: (blog: VideoBlogType) => void }
) {
	const { img, title, _createdAt } = blog
	const formattedDate = formatDate(_createdAt)

	return (
		<ScrollReveal className={className} delay={delay}>
			<button
			type="button"
			onClick={() => onOpen(blog)}
			aria-haspopup="dialog"
			className="group w-full flex flex-col gap-small text-left cursor-pointer"
			>
				<div className="w-full overflow-hidden">
					{/* In flow, taking its height from the image, where it used to be stretched across a box
					    the image had no say in. The drift still has somewhere to go: scale-120 leaves the
					    image overhanging this clip by a tenth of its height at each end.

					    h-auto is not decoration. next/image writes width and height attributes from the two
					    constants above, and a definite height of the image's own is exactly what would make
					    the browser disregard the ratio. */}
					<div data-parallax>
						<Image
							src={buildImageUrl(img, CARD)}
							alt={title}
							width={COVER_WIDTH}
							height={COVER_HEIGHT}
							sizes="(max-width: 768px) 100vw, 50vw"
							className="
								aspect-3/4 w-full h-auto
								object-cover scale-120 transition-[scale]
								duration-300 ease-out group-hover:scale-110
								group-focus-visible:scale-110
							" />
					</div>
				</div>
				<p className="text-small">{formattedDate}</p>
				<h3 className="text-body-3 w-full group-hover:underline group-focus-visible:underline">{title}</h3>
			</button>
		</ScrollReveal>
	)
}
