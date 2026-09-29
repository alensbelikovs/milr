"use client"
import { useState } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import Heading128 from "@/components/typography/Heading128"
import BodyLinkSecondary from "@/components/buttons/BodyLinkSecondary"
import TextLineSplit from "@/components/animation/TextLineSplit"

// How far apart consecutive lines start, the same step every other cascade on the site uses.
const STAGGER = 0.1

// FormSuccess's opposite number, and built the same way — see there for why the timeline is made
// lazily, why there is no scope on the effect, and why this returns a Fragment.
//
// The two ways out are BodyLinkSecondary rather than BodyLink: a filled block is an invitation, and
// there is nothing inviting left to offer once the message has failed to send. Underlined words are
// what the rest of the site uses for a detail the reader may want to act on, which is what an
// address and a number are at this point.
export default function FormError() {
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
		entrance.get().play()
		return () => { entrance.dispose() }
	})

	return (
		<>
			<Heading128
				className="mb-size-192"
				timeline={entrance.get}
				position={0}>
				Oops!
			</Heading128>
			<div className="flex flex-col items-center text-center gap-size-96 col-span-full">
				<div className="flex flex-col gap-size-48">
					<TextLineSplit
						as="p"
						className="text-size-24 font-serif"
						timeline={entrance.get}
						position={STAGGER}>
						Something went wrong:
					</TextLineSplit>
					{/* The break is kept: SplitText cuts on it like any other line break, so the two lines
					    arrive a step apart rather than as one block — which is why the links below start
					    two steps on rather than one. */}
					<TextLineSplit
						as="h3"
						className="text-size-36"
						timeline={entrance.get}
						position={STAGGER * 2}>
						Please contact <br /> me directly
					</TextLineSplit>
				</div>
				{/* linesClassName is what keeps the underline: the reveal clips each line to its own box,
				    and an underline set four pixels under the baseline falls past the bottom of that box.
				    The padding is on the line itself rather than on the mask, so the mask grows with it
				    and the line still starts a full height down — out of sight, not a sliver short. */}
				<div className="flex flex-col items-center gap-size-12">
					<TextLineSplit
						as="div"
						linesClassName="pb-1"
						timeline={entrance.get}
						position={STAGGER * 4}>
						<BodyLinkSecondary href="mailto:">contact@milrstudio.com</BodyLinkSecondary>
					</TextLineSplit>
					<TextLineSplit
						as="div"
						linesClassName="pb-1"
						timeline={entrance.get}
						position={STAGGER * 5}>
						<BodyLinkSecondary href="tel:">+371 28 755 431</BodyLinkSecondary>
					</TextLineSplit>
				</div>
			</div>
		</>
	)
}
