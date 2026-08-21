"use client"
import { useRef } from "react"

import LinkPrimary from "@/components/common/LinkPrimary"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"

export default function Navbar() {
	const navRef = useRef<HTMLElement>(null)

	const navEnterTween = useRef<gsap.core.Tween>(null)

	// Matched to HeroSceneOverlay's heading, so the nav and the heading arrive as one move rather
	// than as two things that happen to start together.
	useGSAP(() => {
		navEnterTween.current = gsap.fromTo(navRef.current,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.5, ease: "power1.inOut", paused: true }
		)
	}, { scope: navRef })

	useTransitionParticipant('navbar', {
		navIn: () => playTween(navEnterTween.current)
	})

	return (
		<header className="fixed top-0 left-0 z-10 w-full text-background">
			<nav ref={navRef} className="p-[16px] flex w-full items-center justify-between gap-[24px]">
				<div className="flex gap-[12px]">
					<LinkPrimary href="/">Home</LinkPrimary>
					<LinkPrimary href="/projects">Projects</LinkPrimary>
					<LinkPrimary href="/about">About</LinkPrimary>
					<LinkPrimary href="/video-blog">Video Blog</LinkPrimary>
				</div>
				<div className="flex gap-[12px]">
					<LinkPrimary href="/contact">Contact</LinkPrimary>
				</div>
			</nav>
		</header>
	)
}
