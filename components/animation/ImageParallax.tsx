"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// Drift and scale are paired: a 1.1 scale leaves exactly 5% of overhang at each end to drift through.
const DRIFT = 5
const OVERHANG = 1.1

// Drifts its children through the parent box on scroll. The parent must be positioned and clip.
export default function ImageParallax({ children }: { children: ReactNode }) {
	const layerRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const layer = layerRef.current
		if (!layer) return

		const mm = gsap.matchMedia()
		mm.add("(min-width: 48rem)", () => {
			gsap.fromTo(layer,
				{ yPercent: -DRIFT, scale: OVERHANG },
				{
					yPercent: DRIFT,
					scale: OVERHANG,
					ease: "none",
					scrollTrigger: {
						trigger: layer.parentElement ?? layer,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
						invalidateOnRefresh: true,
					},
				})
		})

		return () => { mm.revert() }
	}, { scope: layerRef })

	return <div ref={layerRef} className="absolute inset-0">{children}</div>
}
