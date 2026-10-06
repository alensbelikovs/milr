"use client"
import { useRef, useState } from "react"
import Loader from "@/components/icons/Loader"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"

const CLEAR = { opacity: 0, pointerEvents: "none" }
const OPAQUE = { opacity: 1, pointerEvents: "auto" }
const FADE = { paused: true, immediateRender: false, duration: 0.3, ease: "power1.inOut" }

// The curtain covering page swaps; 120vh so mobile rubber-banding never shows what's underneath
export default function TransitionOverlay() {
	const overlayRef = useRef<HTMLDivElement>(null)
	const fadeInRef = useRef<gsap.core.Tween | null>(null)
	const fadeOutRef = useRef<gsap.core.Tween | null>(null)
	// Used as the loader's key, so its CSS entrance replays on every raise
	const [raise, setRaise] = useState(0)

	useGSAP(() => {
		fadeInRef.current = gsap.fromTo(overlayRef.current, CLEAR, { ...OPAQUE, ...FADE })
		fadeOutRef.current = gsap.fromTo(overlayRef.current, OPAQUE, { ...CLEAR, ...FADE })
	}, { scope: overlayRef })

	useTransitionParticipant("transitionOverlay", {
		fadeIn: () => {
			setRaise(count => count + 1)
			return playTween(fadeInRef.current, { counterpart: fadeOutRef.current })
		},
		fadeOut: () => playTween(fadeOutRef.current, { counterpart: fadeInRef.current }),
	})

	return (
		<div
			ref={overlayRef}
			aria-hidden="true"
			className="fixed inset-0 z-15 h-[120vh] w-full bg-background">
			<div key={raise} className="fixed bottom-size-24 right-size-24 animate-loader-in">
				<Loader dimensions={12} fill="var(--foreground)" />
			</div>
		</div>
	)
}
