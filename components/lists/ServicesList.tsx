"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import List from "@/components/lists/List"
import ListItem from "@/components/lists/ListItem"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import type { ServiceType } from "@/types/ContentTypes"

// Every picture rests clipped away entirely — its top edge inset all the way down to its bottom.
// Both insets carry the same four values, so GSAP has numbers on each side to interpolate between.
const HIDDEN = "inset(100% 0% 0% 0%)"
const SHOWN = "inset(0% 0% 0% 0%)"

const REVEAL = { duration: 0.7, ease: "expo.out" }
// The same curve as a function, to read how far an interrupted enter had drawn the picture open.
const revealEase = gsap.parseEase(REVEAL.ease)

type Picture = { element: HTMLElement; enter: gsap.core.Tween; exit: gsap.core.Tween }

// The list and the panel beside it are one component because they share a single piece of state:
// which row the pointer is on. Nothing above this level reacts to it, so it stays here — and
// keeping the boundary here is what lets the section above stay a server component and keep its
// nav link.
//
// A fragment, not a wrapper: both halves are direct children of the section's grid, so an element
// around them would take their place in it and drop the columns each one is positioned into.
export default function ServicesList({ services }: { services: ServiceType[] }) {
	const [hovered, setHovered] = useState<number | null>(null)
	const openService = useSidebarContentStore(state => state.openService)

	const scopeRef = useRef<HTMLDivElement>(null)
	// Keyed by the service's place in the list, not the picture's place among the pictures: services
	// without media render nothing, so the two can drift apart, and hovered counts rows.
	const picturesRef = useRef<Map<number, Picture>>(new Map())
	const previousRef = useRef<number | null>(null)
	// The pictures' keys from the bottom of the stack to the top, the most recently entered last.
	const stackRef = useRef<number[]>([])

	// Each picture's z-index is its place in the stack, so the last one entered sits above the one
	// before it, that one above the one before that, and so on down. Written straight onto the
	// elements rather than through state: it changes on every hover, and nothing else about the
	// render does.
	const restack = () => {
		stackRef.current.forEach((key, position) => {
			const picture = picturesRef.current.get(key)
			if (picture) picture.element.style.zIndex = String(position + 1)
		})
	}

	// Built once per picture and kept, then only ever restarted.
	//
	// The enter is a fromTo, so each restart puts the picture back at full strength and fully
	// clipped before drawing its top edge up — whatever an exit left it at, it comes in the same way.
	// It also renders that from state the moment it is made, which is what hides every picture to
	// begin with.
	//
	// Opacity and scale are in the to state as well, at the same 1 they start at, and that is
	// load-bearing. A fromTo applies its from values through a separate set that only runs when the
	// tween is first made — restart() does not run it again. Only the properties the tween itself
	// animates are put back on a restart, so with opacity and scale in the from state alone, a
	// picture re-entered partway through its exit would draw open still half faded and half shrunk.
	// Tweening them from 1 to 1 puts them back on every frame, the first one included.
	//
	// The exit fades and shrinks the picture while its bottom edge rises to meet its top, clipping it
	// away from the bottom up. It starts from where the enter left the top edge rather than from fully
	// open: a picture let go halfway through its reveal closes up from there instead of snapping open
	// first. That top edge is worked out from the enter's progress through the same ease — not read
	// off the element, whose computed clip-path the browser shortens to fewer values than GSAP would
	// need to match up — and the bottom edge closes to meet it exactly on the last frame. Function
	// values, so invalidating the exit before each play works them out afresh.
	//
	// immediateRender off, because the exit is built after the enter: rendering its from state now
	// would open every picture the enter has just hidden.
	useGSAP(() => {
		const scope = scopeRef.current
		if (!scope) return

		const pictures = picturesRef.current
		pictures.clear()
		gsap.utils.toArray<HTMLElement>("[data-service-picture]", scope).forEach(element => {
			const enter = gsap.fromTo(element,
				{ clipPath: HIDDEN, opacity: 1, scale: 1 },
				{ clipPath: SHOWN, opacity: 1, scale: 1, paused: true, ...REVEAL })

			const top = () => 100 * (1 - revealEase(enter.progress()))
			const exit = gsap.fromTo(element,
				{ clipPath: () => `inset(${top()}% 0% 0% 0%)`, opacity: 1, scale: 1 },
				{
					clipPath: () => `inset(${top()}% 0% ${100 - top()}% 0%)`,
					opacity: 0,
					scale: 0.9,
					immediateRender: false,
					paused: true,
					...REVEAL,
				})

			pictures.set(Number(element.dataset.servicePicture), { element, enter, exit })
		})

		// Nothing has been hovered yet, so the stack starts in list order. Every picture is clipped
		// away at this point, so the order only matters once they start coming in.
		stackRef.current = [...pictures.keys()]
		restack()
	}, { dependencies: [services], scope: scopeRef, revertOnUpdate: true })

	// The row being left plays its exit and the row arrived at plays its enter. Moving straight from
	// one row to the next does both at once; playTween pauses each picture's other tween first, so a
	// picture re-entered mid-exit turns straight around.
	//
	// The entering picture goes to the top of the stack before its enter starts, so it draws open
	// over whatever is still fading out beneath it from the first frame.
	useEffect(() => {
		const pictures = picturesRef.current
		const previous = previousRef.current
		previousRef.current = hovered
		if (previous === hovered) return

		if (previous !== null) {
			const picture = pictures.get(previous)
			picture?.exit.invalidate()
			void playTween(picture?.exit ?? null, { counterpart: picture?.enter })
		}
		if (hovered !== null) {
			const picture = pictures.get(hovered)
			if (picture) {
				stackRef.current = [...stackRef.current.filter(key => key !== hovered), hovered]
				restack()
			}
			void playTween(picture?.enter ?? null, { counterpart: picture?.exit })
		}
	}, [hovered])

	return (
		<>
			<List
				className="
				col-start-1 col-span-full
				md:col-start-2 md:col-span-10
				lg:col-start-2 lg:col-span-6
				">
				{services.map((service, index) => (
					<ListItem
						key={service.title}
						index={index}
						hovered={hovered}
						onClick={() => openService(service)}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						// The rows are buttons now, so they are reachable by keyboard — focus lights
						// the same row a pointer would. focusin/focusout bubble, so these fire for the
						// button inside.
						onFocus={() => setHovered(index)}
						onBlur={() => setHovered(null)}>
						{service.title}
					</ListItem>
				))}
			</List>
			<div className="self-end sticky bottom-6 col-start-9 col-span-3 aspect-4/3 lg:block hidden">
				{/* The stacking context the pictures' z-indexes live in. relative so it is the box they
				    fill, and isolate because relative on its own does not make one — a positioned
				    element with no z-index lets its children's z-indexes out into the page's stack.
				    An inner box rather than classes on the one above, whose sticky a relative would
				    replace. */}
				<div ref={scopeRef} className="relative isolate w-full h-full overflow-hidden">
					{services.map((service, index) => {
						const { media, title } = service
						if (!media) return null

						// Temporary: sample media is a path under /public rather than a Sanity asset, so
						// a leading slash is taken at face value and anything else goes to the CDN
						// builder. Goes when services carry real assets.
						const src = typeof media === "string" && media.startsWith("/")
							? media
							: buildImageUrl(media, CARD)

						return (
							<div
								key={title}
								// No z-index here: restack sets it, in the order the pictures were last entered.
								data-service-picture={index}
								// The clip-path class holds the picture hidden for the server render, which has
								// no GSAP. The enter's from state takes over from it once the tweens are built.
								className="absolute inset-0 [clip-path:inset(100%_0_0_0)] bg-image-placeholder">
								<Image
									src={src}
									alt={title}
									fill
									sizes="25vw"
									quality={99}
									className="object-cover" />
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}
