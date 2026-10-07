"use client"
import { useRef } from "react"
import { useSite } from "@/components/layout/SiteProvider"
import { gsap, useGSAP } from "@/utils/gsap"

const HOLD = 1
const TRAVEL = { duration: 1, ease: "expo.out" }
// Labels wait past their own box so two passing labels never touch
const OFFSCREEN = 120

// Cycles through the dictionary's loading labels for as long as it is mounted
export default function LoadingLabel() {
	const labels = useSite().dict.contact.form.loading
	const trackRef = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		const track = trackRef.current
		if (!track) return

		const labels = gsap.utils.toArray<HTMLElement>("[data-loading-label]", track)
		gsap.set(labels, { yPercent: OFFSCREEN })
		gsap.set(labels[0], { yPercent: 0 })

		const cycle = gsap.timeline({ repeat: -1 })
		labels.forEach((label, index) => {
			cycle
				.to(label, { yPercent: -OFFSCREEN, ...TRAVEL }, `+=${HOLD}`)
				// immediateRender off, or building the last step would hide the first label up front
				.fromTo(labels[(index + 1) % labels.length],
					{ yPercent: OFFSCREEN },
					{ yPercent: 0, immediateRender: false, ...TRAVEL },
					"<")
		})
	}, { scope: trackRef })

	// The first label stays in flow to hold the button's height; the rest stack over it
	return (
		<span ref={trackRef} aria-hidden className="relative flex-1 overflow-hidden text-left">
			{labels.map((label, index) => (
				<span
					key={label}
					data-loading-label
					className={`block ${index === 0 ? "" : "absolute inset-x-0 top-0"}`}>
					{label}
				</span>
			))}
		</span>
	)
}
