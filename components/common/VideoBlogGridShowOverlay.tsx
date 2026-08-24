"use client"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { gsap, useGSAP, SplitText } from "@/utils/gsap"
import type { VideoBlogType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"

// Entrance. One timeline, so the backdrop, the panel, the media and every line of text are phrased
// against a single clock rather than four that happen to start together — the offsets below are
// positions on that clock, and moving one moves it relative to the rest.
const IN_EASE = "expo.out"

const BACKDROP_IN_DURATION = 0.8

const PANEL_IN_DURATION = 1.2
const PANEL_IN_SCALE = 0

// Scaled inside a panel that is scaling too, so the media effectively starts at the product of the
// two. Its own late start is what keeps that reading as a picture growing into the panel rather than
// as one block of white arriving whole.
const MEDIA_IN_DURATION = 1.2
const MEDIA_IN_SCALE = 0.85
const MEDIA_IN_START = 0.1

const TEXT_IN_DURATION = 1.2
// The step TextLineSplit reveals scrolled copy on. Lines arriving in a modal and lines arriving on
// the page are the same gesture, and a rhythm that differed by a frame or two would read as this
// panel being a little off rather than as anything deliberate.
const TEXT_IN_STAGGER = 0.1
const TEXT_IN_START = 0.2

// Exit. Deliberately a different shape rather than the entrance reversed: arriving is an
// introduction and leaving is an acknowledgement, and half a second is generous for the second one.
// Text goes first so the panel is empty by the time it collapses, and the backdrop outlasts both so
// nothing snaps back to the page underneath.
const TEXT_OUT_DURATION = 0.25
const PANEL_OUT_DURATION = 0.4
const PANEL_OUT_START = 0.1
const BACKDROP_OUT_DURATION = 0.35
const BACKDROP_OUT_START = 0.15

// Where the iframe points once the exit has finished. Not an absent src: dropping the attribute
// leaves the document already loaded in there playing to itself, and only a navigation stops it.
const BLANK_MEDIA = "about:blank"

// Mounted whether or not a blog is playing, and shown by toggling display rather than by being
// rendered into existence: a node that only exists while it is open has nothing left to animate on
// the way out. GSAP owns display and pointer-events, so the exit has somewhere to run — display goes
// last, after everything has faded, and the modal is still on screen to watch.
//
// Rendered through a portal into <body> rather than where it sits in the tree. Sections carry their
// own z-index — HomeFeaturedBlogs is relative z-1 — and a z-index makes a stacking context, so a
// modal inside one cannot climb past the section itself however high its own number goes: it would
// sit under the navbar at z-10 with nothing to be done about it from the inside. In <body> it
// competes with the navbar and the curtain directly, at z-12 — over everything on the page, under
// TransitionOverlay's z-15, because a page leaving covers the modal along with the rest of it.
//
// hidden and pointer-events-none are the resting state, written as classes rather than as GSAP's
// first act, because the layout effect below is keyed on isOpen and so does not run for the commit
// that creates this node: nothing sets display until a blog opens, and without them a full-screen
// backdrop is over the page from the moment it mounts. display:grid is GSAP's to give, which is why
// no grid class is here — two owners of one property is a race settled by stylesheet order.
export default function VideoBlogGridShowOverlay(
	{ videoBlog, onClose }:
	{ videoBlog: VideoBlogType | null, onClose: () => void }
) {
	// Open is having a blog to show.
	const isOpen = videoBlog !== null

	// What is on screen: the blog while it is open, and still that blog all the way through the exit.
	// Reading straight off the prop would empty the panel the instant Close was pressed, leaving the
	// exit animating three blank boxes.
	//
	// Adopted during render rather than from an effect, because an effect would let the panel paint
	// once with nothing in it. React throws this render away and re-runs with the new state before
	// anything reaches the screen — the sanctioned way to derive state from a prop.
	const [shownBlog, setShownBlog] = useState<VideoBlogType | null>(null)
	if (videoBlog && videoBlog !== shownBlog) setShownBlog(videoBlog)

	// Whether the iframe is pointed at the blog or at nothing. Separate from shownBlog because the two
	// end at different moments: the text has to survive the exit, the video has to stop at the end of
	// it. Cutting it on close instead would blank the picture while the panel was still collapsing.
	const [isPlayerLive, setIsPlayerLive] = useState(false)
	if (isOpen && !isPlayerLive) setIsPlayerLive(true)

	const { slug, title, description, mediaUrl, _createdAt } = shownBlog ?? ({} as Partial<VideoBlogType>)

	// Ties the dialog to its heading for a screen reader, which is what announces the blog's title on
	// open instead of leaving the dialog unnamed.
	const headingId = useId()

	const rootRef = useRef<HTMLDivElement>(null)
	const backdropRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const mediaRef = useRef<HTMLDivElement>(null)
	const dateRef = useRef<HTMLParagraphElement>(null)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const descriptionRef = useRef<HTMLParagraphElement>(null)
	const closeRef = useRef<HTMLButtonElement>(null)

	const entranceRef = useRef<gsap.core.Timeline | null>(null)
	const exitRef = useRef<gsap.core.Timeline | null>(null)

	const builtForRef = useRef<{ slug?: string, width: number } | null>(null)

	const splitsRef = useRef<SplitText[]>([])

	useGSAP(() => {
		const root = rootRef.current
		if (!root) return

		const textElements = [dateRef.current, titleRef.current, descriptionRef.current, closeRef.current]

		const build = (isResplit: boolean) => {
			if (isResplit) for (let i = splitsRef.current.length - 1; i >= 0; i--) splitsRef.current[i].revert()
			splitsRef.current = []

			entranceRef.current?.kill()
			exitRef.current?.kill()

			// Split at rest. SplitText groups lines by getBoundingClientRect, which an ancestor transform
			// scales, and the exit leaves the panel at PANEL_OUT scale — so from the second open onward a
			// split would measure every word as zero wide in the same spot and hand back one line per
			// element, flattening the cascade. The entrance's own fromTo writes the from-state back below,
			// inside this same layout effect, so nothing paints at full size.
			gsap.set([panelRef.current, mediaRef.current], { scale: 1 })

			const titleMask = SplitText.create(titleRef.current, { type: "lines", linesClass: "overflow-hidden" })
			const titleReveal = SplitText.create(titleMask.lines, { type: "lines" })
			const descriptionMask = SplitText.create(descriptionRef.current, { type: "lines", linesClass: "overflow-hidden" })
			const descriptionReveal = SplitText.create(descriptionMask.lines, { type: "lines" })
			splitsRef.current = [titleMask, titleReveal, descriptionMask, descriptionReveal]

			const textLines = [
				dateRef.current,
				...titleReveal.lines,
				...descriptionReveal.lines,
				closeRef.current,
			]

			entranceRef.current = gsap.timeline({ paused: true })
				.set(textElements, { opacity: 1 }, 0)
				.fromTo(backdropRef.current,
					{ opacity: 0 },
					{ opacity: 1, duration: BACKDROP_IN_DURATION, ease: IN_EASE }, 0)
				.fromTo(panelRef.current,
					{ scale: PANEL_IN_SCALE },
					{ scale: 1, duration: PANEL_IN_DURATION, ease: IN_EASE }, 0)
				.fromTo(mediaRef.current,
					{ scale: MEDIA_IN_SCALE },
					{ scale: 1, duration: MEDIA_IN_DURATION, ease: IN_EASE }, MEDIA_IN_START)
				.fromTo(textLines,
					{ yPercent: -100 },
					{ yPercent: 0, duration: TEXT_IN_DURATION, ease: IN_EASE, stagger: TEXT_IN_STAGGER }, TEXT_IN_START)

			exitRef.current = gsap.timeline({
				paused: true,
				onComplete: () => {
					gsap.set(rootRef.current, { display: "none" })
					setIsPlayerLive(false)
				},
			})
				.to(textElements, { opacity: 0, duration: TEXT_OUT_DURATION, ease: "power2.out" }, 0)
				.to(panelRef.current, { scale: 0, duration: PANEL_OUT_DURATION, ease: "power2.in" }, PANEL_OUT_START)
				.to(backdropRef.current, { opacity: 0, duration: BACKDROP_OUT_DURATION, ease: "power1.out" }, BACKDROP_OUT_START)
		}

		if (isOpen) {
			gsap.set(root, { display: "grid", pointerEvents: "auto" })

			const width = window.innerWidth
			const builtFor = builtForRef.current
			if (builtFor === null || builtFor.slug !== slug || builtFor.width !== width) {
				build(builtFor !== null && builtFor.slug === slug)
				builtForRef.current = { slug, width }
			}

			exitRef.current?.pause()
			entranceRef.current?.play(0)
			return
		}

		if (!entranceRef.current) return

		gsap.set(root, { pointerEvents: "none" })
		entranceRef.current.pause()
		exitRef.current?.invalidate().play(0)
	}, { dependencies: [isOpen], scope: rootRef })

	// document is not there to portal into on the server, so the first render puts out nothing and the
	// node arrives on mount. Nothing is lost by the wait: the modal is closed until a card is pressed,
	// and a card cannot be pressed before hydration.
	const [isPortalReady, setIsPortalReady] = useState(false)
	useEffect(() => setIsPortalReady(true), [])

	useEffect(() => {
		if (isOpen) closeRef.current?.focus({ preventScroll: true })
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose()
		}
		document.addEventListener("keydown", onKeyDown)
		return () => document.removeEventListener("keydown", onKeyDown)
	}, [isOpen, onClose])

	if (!isPortalReady) return null

	return createPortal(
		<div
		ref={rootRef}
		onClick={event => { if (event.target === event.currentTarget) onClose() }}
		className="
			hidden pointer-events-none
			fixed left-0 top-0 z-12 h-screen w-full
			grid-cols-15 gap-regular
			grid-rows-12
		"
		>
			<div
			ref={backdropRef}
			className="
				absolute inset-0 pointer-events-none
				bg-black/50 bg-linear-to-b from-black/0 to-black
			" />
			<div
			ref={panelRef}
			role="dialog"
			aria-modal="true"
			aria-labelledby={headingId}
			className="
				bg-background p-regular flex relative
				col-start-4 col-span-9
				gap-regular
				row-span-10 row-start-2
			"
			>
				<div ref={mediaRef} className="h-full aspect-10/16">
					<iframe
						src={isPlayerLive ? mediaUrl : BLANK_MEDIA}
						title={title}
						allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
						allowFullScreen
						className="bg-black/10 h-full w-full border-0" />
				</div>
				<div
				className="
					flex flex-col
					relative
					pt-normal-3 pl-normal-2 pr-normal-3 w-full
				"
				>
					<div className="overflow-hidden mb-small">
						<p ref={dateRef} className="text-small">{_createdAt && formatDate(_createdAt)}</p>
					</div>
					<h3 key={`title-${slug}`} ref={titleRef} id={headingId} className="text-subheading">{title}</h3>
					<p key={`description-${slug}`} ref={descriptionRef} className="text-body-2 mt-normal-1">{description}</p>
					<div className="absolute right-0 top-0 overflow-hidden pb-micro">
						<button
							ref={closeRef}
							type="button"
							onClick={onClose}
							className="link-primary">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body
	)
}
