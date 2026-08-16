"use client"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import { useRef } from "react"

const CLEAR = { opacity: 0, pointerEvents: "none" }
const OPAQUE = { opacity: 1, pointerEvents: "auto" }

export default function TransitionOverlay() {
	const overlayRef = useRef<HTMLDivElement>(null)

	const fadeInTweenRef = useRef<gsap.core.Tween | null>(null)
	const fadeOutTweenRef = useRef<gsap.core.Tween | null>(null)

	useGSAP(() => {
		fadeInTweenRef.current = gsap.fromTo(overlayRef.current,
			CLEAR,
			{ ...OPAQUE, paused: true, immediateRender: false, duration: 0.4, ease: "power4.out" }
		)
		fadeOutTweenRef.current = gsap.fromTo(overlayRef.current,
			OPAQUE,
			{ ...CLEAR, paused: true, immediateRender: false, duration: 0.4, ease: "power4.out" }
		)
	}, { scope: overlayRef })

	useTransitionParticipant("transitionOverlay", {
		fadeIn: () => playTween(fadeInTweenRef.current, { counterpart: fadeOutTweenRef.current }),
		fadeOut: () => playTween(fadeOutTweenRef.current, { counterpart: fadeInTweenRef.current }),
	})

	return (
		<div
			ref={overlayRef}
			aria-hidden="true"
			className="fixed inset-0 z-15 h-screen w-full bg-white"
		/>
	)
}
