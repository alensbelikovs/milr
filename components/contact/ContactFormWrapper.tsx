"use client"

import { useRef, useState, type ReactNode } from "react"
import { useLenis } from "lenis/react"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import Heading128 from "@/components/typography/Heading128"
import ContactForm from "@/components/contact/ContactForm"
import ContactResult from "@/components/contact/ContactResult"
import type { ContactStatusType } from "@/types/ContactTypes"

// The cross-fade between the two states. Short on purpose: this is a seam the reader is waiting
// through, not an entrance, and the cascade on the other side is the part worth watching.
const FADE = { duration: 0.4, ease: "power2.out" }

// The client boundary for the contact section. It lives here rather than in Contact so that
// Contact stays a server component — SectionNavWrapper reads navLabel off the section's element
// type, and a "use client" section would arrive as a module reference and drop out of the nav.
//
// The heading is passed down rather than left with Contact because it is part of what changes: the
// section goes from asking for a message to answering one, and the words at the top change with
// the words below them. Holding both here is what lets a single element fade out, swap, and fade
// back in — with the heading still rendered by Contact, the block would change underneath a
// heading that sat there unmoved.
//
// Both fades are built once, against the container, and left paused. fromTo with immediateRender
// off, so neither writes an opacity until it is actually played: a from-value applied at build time
// would leave the idle form invisible, and a plain `to` would have to guess where it started.
export default function ContactFormWrapper() {
	const [status, setStatus] = useState<ContactStatusType | "idle">("idle")
	const containerRef = useRef<HTMLDivElement>(null)
	const fadeOutRef = useRef<gsap.core.Tween | null>(null)
	const fadeInRef = useRef<gsap.core.Tween | null>(null)

	// The root instance, published globally by the ReactLenis in the layout rather than through a
	// provider above this — which is why a bare useLenis reaches it from here, the same way the
	// sidebar and the section nav do.
	const lenis = useLenis()

	useGSAP(() => {
		fadeOutRef.current = gsap.fromTo(containerRef.current,
			{ opacity: 1 },
			{ opacity: 0, ...FADE, paused: true, immediateRender: false })
		fadeInRef.current = gsap.fromTo(containerRef.current,
			{ opacity: 0 },
			{ opacity: 1, ...FADE, paused: true, immediateRender: false })
	}, { scope: containerRef })

	// Lenis rather than a native jump, for the reason TransitionControl gives at length: Lenis
	// drives the real document scroll in root mode, so moving window.scrollY out from under its rAF
	// loop leaves its internal target on the old value and the next wheel event pulls back against
	// the jump. The window is the fallback for the frame or two after a hard load, before Lenis has
	// resolved.
	const scrollToTop = () => {
		if (lenis) {
			lenis.scrollTo(0, { immediate: true })
			return
		}
		window.scrollTo(0, 0)
	}

	// Awaited rather than fired and forgotten: the swap waits for the block to be gone, so the
	// result is never mounted over a form that is still on its way out. ContactForm stays mounted
	// and still reading "Loading" for the length of the fade, which is what it should be doing —
	// the send is not over until the form has left.
	//
	// The page goes back to the top in the gap between the two fades, while there is nothing on
	// screen to watch it happen — the reader was most likely standing at the bottom of a long page
	// to reach the form, and the answer is a short block that belongs read from the top. immediate,
	// because a smooth scroll under an invisible block is time spent on a journey nobody can see.
	//
	// Before the commit rather than after, which is the order TransitionControl uses for the same
	// move: the result mounts already at the top, so anything measuring the document as it is built
	// reads the position it will actually be looked at from.
	async function handleResult(next: ContactStatusType) {
		await playTween(fadeOutRef.current, { counterpart: fadeInRef.current })
		scrollToTop()
		setStatus(next)
	}

	// The other half of the swap. A layout effect, so it runs in the same commit that mounts the
	// result and before anything is painted — and after the result's own children, which hold their
	// lines out of sight as they are built. So the block comes back up with the new content already
	// in its starting position, and the cascade ContactResult plays on mount runs as the opacity
	// climbs rather than after it.
	useGSAP(() => {
		if (status === "idle") return
		fadeInRef.current?.restart()
	}, { dependencies: [status], scope: containerRef })

	// One element for both states, because it is the element that fades. col-span-full puts it
	// across the section's grid, and what is inside lays itself out from there exactly as it did
	// when the heading and the form were siblings in that grid.
	return (
		<div ref={containerRef} className="col-span-full">
			{status === "idle"
				? (
					<>
						<Heading128 className="mb-size-192">Contact</Heading128>
						<ContactForm onResult={handleResult} />
					</>
				)
				: <ContactResult status={status} />}
		</div>
	)
}
