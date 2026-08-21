import Image from "next/image"
import Link from "next/link"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import ScrollReveal from "@/components/common/ScrollReveal"
import type { VideoBlogType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"
import { videoBlogShowPath } from "@/utils/videoBlogRoute"

// A link whose href is the /video-blog/<slug> the grid pushes when the player opens, so the card is
// a real link — copyable, focusable, and naming the address the page will actually wear — while the
// player still opens as a dialog on this page.
//
// The click is intercepted for every button and modifier, not just the plain one, because nothing
// resolves that path: a cold hit on it lands on Not Found, so a new tab is worse than no new tab.
// Prefetch is off for the same reason — Next would otherwise fetch a 404 for every card on screen.
// Give /video-blog/[slug] a page and both of those decisions are worth revisiting.
//
// The outer box is ScrollReveal, which is where the cover's drift comes from — the reveal on the way
// in comes with it, the same pairing the project cards get. It takes the placement and the aspect, so
// the link underneath still measures the whole card and nothing moves a level.
//
// The cover is a box around the image because GSAP writes `scale: none` inline on whatever it
// transforms, which kills a scale class on that element and the hover variant with it. Wrapper
// drifts, image scales: 1.2 at rest and 1.1 under the pointer, the floor a ±5% drift needs to keep
// an edge covered at the ends of the scroll.
export default function VideoBlogGridItem(
	{ blog, className, delay, onOpen }:
	{ blog: VideoBlogType, className: string, delay?: number, onOpen: (blog: VideoBlogType) => void }
) {
	const { img, title, slug, _createdAt } = blog
	const formattedDate = formatDate(_createdAt)

	return (
		<ScrollReveal className={className + " aspect-3/4"} delay={delay}>
			<Link
			href={videoBlogShowPath(slug)}
			prefetch={false}
			onClick={event => {
				event.preventDefault()
				onOpen(blog)
			}}
			aria-haspopup="dialog"
			className="group h-full w-full flex flex-col gap-small"
			>
				<div className="relative h-full w-full overflow-hidden">
					<div data-parallax className="absolute inset-0">
						<Image
							src={buildImageUrl(img, CARD)}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="
								object-cover scale-120 transition-[scale]
								duration-300 ease-out group-hover:scale-110
								group-focus-visible:scale-110
							" />
					</div>
				</div>
				<p className="text-small">{formattedDate}</p>
				<h3 className="text-body-3 w-full group-hover:underline group-focus-visible:underline">{title}</h3>
			</Link>
		</ScrollReveal>
	)
}
