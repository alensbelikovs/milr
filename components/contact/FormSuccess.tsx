"use client"
import { useState } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import Heading128 from "@/components/typography/Heading128"
import BodyLink from "@/components/buttons/BodyLink"
import TextLineSplit from "@/components/animation/TextLineSplit"

// How far apart consecutive lines start, the same step every other cascade on the site uses.
const STAGGER = 0.1

// The contact section once the message has gone: the same heading slot the form wore, holding other
// words, over a body that says what happened.
//
// It owns one timeline for the whole thing — heading and body both — so the result arrives as a
// single cascade from the top down. A trigger per line does nothing useful here: the block is
// already in view the moment it exists, so every trigger would fire at once and the order the
// reader should read it in would be lost. Nothing waits on a scroll for the same reason. Mounting
// is the cue, and ContactFormWrapper mounts this fresh in the form's place.
//
// The timeline is made on first ask rather than during render, the same as List's and
// SidebarMenuBody's: a client component still renders on the server, and a timeline made there
// would be left on the server's own global timeline for every request. The children also need to be
// able to bring it into being themselves, because their effects run BEFORE this one — children
// commit first. dispose clears the slot, so a remount — dev's StrictMode unmounts and remounts
// every effect once — gets a fresh timeline rather than a killed one that will not play.
//
// A Fragment rather than a wrapper, so the heading sits where it always did: a block with its own
// bottom margin above the column, not a third item inside a column spaced by gap-size-96.
//
// items-center on the column, so the groups are each only as wide as their own widest line rather
// than spread across the section. The text groups keep the default stretch, which is what lets
// text-center do the centring there; the link group is centred by its own items-center, because a
// BodyLink is sized to its label and would otherwise sit against the group's left edge while the
// copy above it is centred.
export default function FormSuccess() {
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

	// Last, once every line has added itself. No scope: nothing here is selected by name and nothing
	// is built here — the children own the tweens — so a scope would only force a wrapper element
	// that the layout does not want. Below lg the reveals are gated off, the timeline is empty, and
	// this plays nothing.
	useGSAP(() => {
		entrance.get().play()
		return () => { entrance.dispose() }
	})

	return (
		<>
			{/* The same margin the idle heading carries, so the body below it sits where the form did
			    rather than jumping up the page as the two are swapped. One line, so it takes one step
			    and the body starts on the next. */}
			<Heading128
				className="mb-size-192"
				timeline={entrance.get}
				position={0}>
				Thank You!
			</Heading128>
			<div className="flex flex-col items-center text-center gap-size-96 col-span-full">
				<div className="flex flex-col gap-size-48">
					<TextLineSplit
						as="p"
						className="text-size-24 font-serif"
						timeline={entrance.get}
						position={STAGGER}>
						Chat Soon:
					</TextLineSplit>
					{/* h3 and h4 rather than the h4 and h5 these were: the words above them are the
					    section's h2 now, so the outline closes back up. */}
					<div className="flex flex-col gap-size-12">
						<TextLineSplit
							as="h3"
							className="text-size-36"
							timeline={entrance.get}
							position={STAGGER * 2}>
							September 15
						</TextLineSplit>
						<TextLineSplit
							as="h4"
							className="text-size-24"
							timeline={entrance.get}
							position={STAGGER * 3}>
							between 8:00 – 19:00
						</TextLineSplit>
					</div>
				</div>
				<div className="flex flex-col items-center gap-size-12">
					{/* The filled block, which is what the confirmation deserves to be: it is the one
					    thing here the reader is meant to act on. It rises as one piece rather than line
					    by line — it is a block, not copy — but on the same timeline, one step after the
					    hours above it. */}
					<BodyLink
						href="/"
						timeline={entrance.get}
						position={STAGGER * 4}>
						View Confirmation
					</BodyLink>
				</div>
			</div>
		</>
	)
}
