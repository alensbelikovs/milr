"use client"
import { useRef } from "react"

import LinkPrimary from "@/components/common/LinkPrimary"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import Link from "next/link"
import Logo from "@/components/common/Logo"

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
		<header className="fixed top-0 left-0 z-10 w-full text-background mix-blend-difference">
			<nav ref={navRef} className="py-regular px-[36px] gap-[36px] grid grid-cols-12">
				<Link href="/">
					<Logo dimensions="32"/>
				</Link>
				<div className="flex gap-regular col-start-7 col-span-3">
					<LinkPrimary href="/projects" target="_self">Projects</LinkPrimary>
					<LinkPrimary href="/diary" target="_self">Diary</LinkPrimary>
					<LinkPrimary href="/about" target="_self">About</LinkPrimary>
				</div>
				<div className="flex justify-end col-start-10 col-span-3">
					<LinkPrimary href="mailto:contact@milrstudio.com">contact@milrstudio.com</LinkPrimary>
				</div>
			</nav>
		</header>
	)
}
