"use client"
import { useRef, useState } from "react"
import { type PostType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"
import Image from "next/image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import Link from "next/link"
import { gsap, useGSAP } from "@/utils/gsap"
import TextLineSplit from "@/components/animation/TextLineSplit"

// How far behind the heading the picture starts.
const STAGGER = 0.1

// The same travel and timing ScrollReveal gives a card on the page — this is the same card, opened
// up — so the picture arrives the way it did in the grid.
const REVEAL = { duration: 1.2, ease: "expo.out" }

// The heading rises a line at a time, and the picture follows it up a step later. It leaves with no
// animation of its own: the sidebar fades whatever it is showing as the panel slides away.
//
// The sidebar mounts this fresh for every post it is handed (see its contentKey), so the entrance
// is played once, on mount — and a second post clicked while this one is open arrives as a new
// instance with its own markup, rather than a new title poured into lines cut for the old one.
export default function SidebarPostBody(
	{ post }:
		{ post: PostType }) {
	const { title, _createdAt, media, externalUrl } = post

	const scopeRef = useRef<HTMLDivElement>(null)
	const pictureRef = useRef<HTMLDivElement>(null)

	// The entrance, which the heading adds itself to. Made on first ask for the same reason as the
	// menu's: the heading's effect runs BEFORE this component's, so it has to be able to bring the
	// timeline into being — and one made during render would also be made on the server.
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

		// 64rem is Tailwind's lg, the line every reveal on the site draws. Below it the post is
		// simply there, and the panel's slide is the whole of the transition.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// A quarter of the viewport, in pixels, the same as ScrollReveal. autoAlpha rather than
			// opacity for the same reason too: the picture holds the View link, and a link that is
			// not there yet should not be clickable.
			const rise = () => window.innerHeight * 0.25

			entrance.get().add(
				gsap.fromTo(picture,
					{ autoAlpha: 0, y: rise },
					{ autoAlpha: 1, y: 0, ...REVEAL }),
				STAGGER)
		})

		// Last, once the heading has added itself — its effect ran before this one. Below lg the
		// timeline is empty and this plays nothing.
		entrance.get().play()

		return () => {
			mm.revert()
			entrance.dispose()
		}
	}, { scope: scopeRef })

	return (
		<div
			ref={scopeRef}
			className="grid grid-cols-6
			px-size-24 gap-x-size-24
			gap-y-size-96 py-size-96">
			<div className="col-start-2 col-span-4 flex gap-size-96 flex-col items-center text-center">
				<div className="flex flex-col gap-size-48">
					<p className="text-size-18 font-serif text-foreground/50">{formatDate(_createdAt)}</p>
					<TextLineSplit as="h3" className="text-size-48" timeline={entrance.get}>
						{title}
					</TextLineSplit>
				</div>
				<div
					ref={pictureRef}
					className="
					relative
					overflow-hidden aspect-3/4
					w-full
					flex items-center justify-center
					bg-image-placeholder group">
					{
						media &&
						<div className="absolute inset-0 scale-110 group-hover:scale-100">
							<Image
								src={buildImageUrl(media, CARD)}
								alt={title}
								quality={99}
									className="w-full h-full object-cover" />
							<div className="bg-foreground/20"/>
						</div>
					}
					<Link
						href={externalUrl}
						target="_blank"
						className={`absolute inset-0 flex items-center
						justify-center text-size-24
						group-hover:underline
						${media ? "text-background" : "text-foreground"}`}>
						View
					</Link>
				</div>
			</div>

			</div>
	)
}
