"use client"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import Loader from "@/components/icons/Loader"
import { useRef, useState } from "react"

const CLEAR = { opacity: 0, pointerEvents: "none" }
const OPAQUE = { opacity: 1, pointerEvents: "auto" }

export default function TransitionOverlay() {
	const overlayRef = useRef<HTMLDivElement>(null)

	// Bumped every time the curtain is raised, and used as the spinner's key — which is the whole of
	// how its entrance is restarted. A CSS animation runs once per element, so the only way to play
	// it again is to give React a different element to mount, and a changed key is exactly that.
	// Nothing reads the number itself.
	const [raise, setRaise] = useState(0)

	const fadeInTweenRef = useRef<gsap.core.Tween | null>(null)
	const fadeOutTweenRef = useRef<gsap.core.Tween | null>(null)

	useGSAP(() => {
		fadeInTweenRef.current = gsap.fromTo(overlayRef.current,
			CLEAR,
			{ ...OPAQUE, paused: true, immediateRender: false, duration: 0.3, ease: "power1.inOut" }
		)
		fadeOutTweenRef.current = gsap.fromTo(overlayRef.current,
			OPAQUE,
			{ ...CLEAR, paused: true, immediateRender: false, duration: 0.3, ease: "power1.inOut" }
		)
	}, { scope: overlayRef })

	// These are captured on the first render and never rebuilt — see the hook — so everything they
	// reach for is a ref or a setState, both of which keep their identity for the life of the
	// component.
	useTransitionParticipant("transitionOverlay", {
		fadeIn: () => {
			// Ahead of the curtain rather than after it: the two seconds the spinner waits out should
			// be counted from the moment the navigation started, not from the moment the fade
			// happened to finish.
			setRaise(count => count + 1)
			return playTween(fadeInTweenRef.current, { counterpart: fadeOutTweenRef.current })
		},
		fadeOut: () => playTween(fadeOutTweenRef.current, { counterpart: fadeInTweenRef.current }),
	})

	return (
		<div
			ref={overlayRef}
			aria-hidden="true"
			className="fixed inset-0 z-15 h-[120vh] w-full bg-background">
			{/* fixed rather than absolute, and that is not a preference. The curtain is 120vh tall so
			    that nothing shows through underneath it when a mobile browser rubber-bands, which puts
			    its bottom edge a fifth of a screen BELOW the fold — an absolutely positioned child sat
			    against that edge would sit there too, out of sight. Fixed measures the viewport
			    instead, and still fades with the curtain, because opacity applies to a whole subtree
			    however its members are positioned.

			    Keyed, so each raise of the curtain mounts a new element and the entrance below plays
			    from the top. It plays on first mount as well, which is right: a cold load starts with
			    the curtain already opaque and waits for the page the same way a navigation does. */}
			<div
				key={raise}
				className="fixed bottom-size-24 right-size-24 animate-loader-in">
				<Loader dimensions={12} fill="var(--foreground)" />
			</div>
		</div>
	)
}
