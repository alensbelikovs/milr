"use client"
import { useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// Covers its (relative) parent and fades out with the scroll, from the parent's top entering the viewport
// until that top reaches a quarter of the way down. Placed last, so it paints over the parent's content.
export default function ScrollFadeOverlay({ className = "" }: { className?: string }) {
	const overlayRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const overlay = overlayRef.current
		if (!overlay) return

		gsap.fromTo(overlay,
			{ opacity: 1 },
			{
				opacity: 0,
				ease: "none",
				scrollTrigger: {
					trigger: overlay.parentElement,
					start: "top bottom",
					end: "top 25%",
					scrub: true,
				},
			})
	}, { scope: overlayRef })

	return <div ref={overlayRef} aria-hidden className={`absolute inset-0 z-1 pointer-events-none ${className}`} />
}
