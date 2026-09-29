"use client"
import { useRef, useState } from "react"
import Image from "@/components/media/Image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import { type SanityImageSource } from "@sanity/image-url"
import { gsap, useGSAP } from "@/utils/gsap"
import TextLineSplit from "@/components/animation/TextLineSplit"

// How far behind the paragraph the picture starts.
const STAGGER = 0.1

// The same travel and timing as the post panel's picture, so the two panels arrive the same way.
const REVEAL = { duration: 1.2, ease: "expo.out" }

// The sidebar's plain panel: a heading, a paragraph under it, and a picture at the bottom. Anything
// with those and nothing more opens through this rather than getting a body of its own.
//
// body and media are optional because not everything that opens it has them, and a panel that
// renders only what it was handed is what lets the wiring be built before the content exists.
//
// The paragraph rises a line at a time and the picture slides up behind it, the post panel's
// entrance. No exit of its own: the sidebar fades whatever it is showing as the panel slides away.
// Mounted fresh for every open (see Sidebar's contentKey), so the entrance plays once, on mount.
export default function SidebarGeneralBody(
	{ title, body, media }:
		{ title: string; body?: React.ReactNode; media?: SanityImageSource }) {
	const scopeRef = useRef<HTMLDivElement>(null)
	const pictureRef = useRef<HTMLDivElement>(null)

	// Temporary: sample media is a path under /public rather than a Sanity asset, so a leading slash
	// is taken at face value and anything else goes to the CDN builder. Goes when services carry real
	// assets.
	const src = !media
		? null
		: typeof media === "string" && media.startsWith("/")
			? media
			: buildImageUrl(media, CARD)

	// The entrance, which the paragraph adds itself to. Made on first ask for the same reason as the
	// other panels': the paragraph's effect runs BEFORE this component's, so it has to be able to
	// bring the timeline into being — and one made during render would also be made on the server.
	const [entrance] = useState(() => {
		let timeline: gsap.core.Timeline | null = null
		return {
			get: () => timeline ??= gsap.timeline({ paused: true }),
			dispose: () => {
				timeline?.kill()
				timeline = null
			},
		}
	})

	useGSAP(() => {
		const picture = pictureRef.current
		if (!picture) return

		// 64rem is Tailwind's lg, the line every reveal on the site draws. Below it the panel is
		// simply there, and its slide is the whole of the transition.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// A quarter of the viewport, in pixels, the same as the post panel's picture.
			const rise = () => window.innerHeight * 0.25

			entrance.get().add(
				gsap.fromTo(picture,
					{ autoAlpha: 0, y: rise },
					{ autoAlpha: 1, y: 0, ...REVEAL }),
				STAGGER)
		})

		// Last, once the paragraph has added itself — its effect ran before this one. Below lg the
		// timeline is empty and this plays nothing.
		entrance.get().play()

		return () => {
			mm.revert()
			entrance.dispose()
		}
	}, { scope: scopeRef })

	return (
		// min-h-full, so the panel is at least as tall as the sidebar scrolling it. Without it the
		// grid is only as tall as its content and there is no slack for the picture to sit at the
		// bottom of. A min rather than a height, so a long paragraph grows past it and the sidebar's
		// own overflow-y-auto takes it from there.
		//
		// Rows of [auto 1fr]: the text takes what it needs, the second row takes whatever is left,
		// and self-end on the picture drops it to the bottom of that row. self-end is also what keeps
		// its proportions — a grid item left to stretch would fill the tall row and lose the ratio.
		//
		// pb rather than a margin under the picture, so the same 24px is there whether it was pushed
		// to the bottom or scrolled down to.
		//
		// overflow-clip for the entrance. The picture starts a quarter of the viewport below where it
		// sits — and where it sits is the bottom of the panel, so the start is past the edge. Left
		// unclipped, that overhang would make the panel scrollable for the length of the rise: a
		// scrollbar arriving and leaving, and on a system whose scrollbars take width, the content
		// narrowing under it and the paragraph re-cut mid-reveal. Clipped, it rises in from the
		// panel's edge. clip rather than hidden, so this does not become a scroll container of its
		// own — it grows with its content as before, and only the overhang is cut.
		<div
			ref={scopeRef}
			className="grid grid-cols-6 grid-rows-[auto_1fr] min-h-full overflow-clip
			px-size-24 gap-x-size-24
			gap-y-size-96 pt-size-96 pb-size-24">
			<div className="col-start-2 col-span-4 flex flex-col gap-x-size-24">
				<h5 className="font-serif text-size-18 opacity-50">{ title }</h5>
				{
					body &&
					<TextLineSplit className="text-size-24 mt-size-48" timeline={entrance.get}>
						{ body }
					</TextLineSplit>
				}
			</div>
			<div
				ref={pictureRef}
				className="
				self-end
				relative
				overflow-hidden aspect-16/10
				w-full
				col-span-full
				flex items-center justify-center
				bg-image-placeholder">
				{
					src &&
					<Image
						src={src}
						alt={title}
						fill
						// The panel is half the viewport and the picture spans it.
						sizes="50vw"
						quality={99}
						// Our own Image, which scales the picture down into place once the file is
						// decoded. It animates the img itself, while the entrance above slides the box
						// around it — two transforms, two elements.
						className="object-cover" />
				}
			</div>
		</div>
	)
}
