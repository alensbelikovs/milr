"use client"

import { useRef } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/utils/gsap"
import LinkPrimary from "@/components/common/LinkPrimary"
import LinkSecondary from "@/components/common/LinkSecondary"
import RevealMask from "@/components/common/RevealMask"
import FooterGroup from "@/components/layout/FooterGroup"
import LinkSmall from "@/components/common/LinkSmall"

// Where along the wrapper's scroll range each part reveals, as ScrollTrigger progress. With the
// start and end set below, 0.5 is the moment the footer covers the screen and 1 is the bottom of the
// page — so all three of these land while the footer is sitting still in full view.
const FOOTNOTE_PROGRESS = 0.55
const GROUPS_PROGRESS = 0.65
const HEADING_PROGRESS = 0.9

const DURATION = 1.5
const EASE = "expo.out"

// Reverse, so a group unfolds upwards: the last link goes first and the title lands last.
const GROUP_STAGGER = 0.1
const GROUP_STAGGER_FROM = "end"

export default function Footer({ heading="Ready when You are." }: { heading?: string }) {
	const triggerRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const trigger = triggerRef.current
		if (!trigger) return

		const masksIn = (root: Element | null) =>
			root ? Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")) : []

		// Paused, because scroll position decides when these play, not their own creation. fromTo
		// still writes the start values the moment it is built, and that is what holds the contents
		// under their masks until then.
		const reveal = (targets: HTMLElement[], stagger?: gsap.StaggerVars) =>
			gsap.fromTo(targets,
				{ yPercent: 100 },
				{ yPercent: 0, duration: DURATION, ease: EASE, stagger, paused: true }
			)

		// A tween per group rather than one across all of them: the reverse stagger belongs inside a
		// group, and a single tween over every line in the row would run that order across the row
		// instead — the rightmost column first, the leftmost last.
		const groups = Array.from(trigger.querySelectorAll("[data-footer-group]"))

		const steps = [
			{ at: FOOTNOTE_PROGRESS, tweens: [reveal(masksIn(trigger.querySelector("[data-footer-footnote]")))] },
			{ at: GROUPS_PROGRESS, tweens: groups.map(group => reveal(masksIn(group), { each: GROUP_STAGGER, from: GROUP_STAGGER_FROM })) },
			{ at: HEADING_PROGRESS, tweens: [reveal(masksIn(trigger.querySelector("[data-footer-heading]")))] },
		].map(step => ({ ...step, played: false }))

		// Forward only, and once each: scrolling back up leaves what has been revealed where it is.
		const playDue = (progress: number) => {
			for (const step of steps) {
				if (step.played || progress < step.at) continue
				step.played = true
				step.tweens.forEach(tween => tween.play())
			}
		}

		ScrollTrigger.create({
			trigger,
			// The wrapper is a screen taller than the footer and starts a screen high, so the usual
			// "bottom top" range would spend most of its progress on scroll the footer is not on
			// screen for. Ending when the wrapper's bottom edge reaches the bottom of the viewport
			// ends the range at the bottom of the page — the footer's last frame in view — which is
			// what makes the progress numbers above readable as positions inside the footer.
			start: "top bottom",
			end: "bottom bottom",
			onUpdate: self => playDue(self.progress),
			// A reload partway down the footer never fires onUpdate on its own. Refresh runs once at
			// creation, which covers that, and again on every resize, which is harmless: steps that
			// have already played are skipped.
			onRefresh: self => playDue(self.progress),
		})
	}, { scope: triggerRef })

	return (
		<div ref={triggerRef} className="relative h-[200vh] -mt-[100vh]">
			<footer
			className="
				sticky flex flex-col justify-between
				pb-normal-1 min-h-screen top-0 left-0
				pt-section px-regular w-full bg-foreground
				gap-normal-3
				text-background
				"
			>
				<div data-footer-heading className="flex lg:justify-center">
					<RevealMask>
						<h2 className="text-heading-2">{heading}</h2>
					</RevealMask>
				</div>
				<div className="grid grid-cols-12 gap-regular">
					<div className="flex flex-col gap-normal-3 col-span-full lg:col-start-2 lg:col-span-10">
						<div className="grid grid-cols-2 gap-x-regular gap-y-normal-2 lg:flex lg:justify-between">
							<FooterGroup title="See Next">
								<LinkPrimary href="/about">About</LinkPrimary>
								<LinkPrimary href="/about">Projects</LinkPrimary>
								<LinkPrimary href="/about">Diary</LinkPrimary>
								<LinkPrimary href="/about">Contact</LinkPrimary>
							</FooterGroup>
							<FooterGroup title="Contacts">
								<LinkPrimary href="">contact@milrstudio.com</LinkPrimary>
								<LinkPrimary href="">+371 28 755 431</LinkPrimary>
							</FooterGroup>
							<FooterGroup title="Socials">
								<LinkPrimary href="">Instagram</LinkPrimary>
								<LinkPrimary href="">TikTok</LinkPrimary>
							</FooterGroup>
							<FooterGroup title="Address">
								<p className="text-body-1">Aleksandra Čaka 56</p>
								<p className="text-body-1">LV-1011, Rīga</p>
								<p className="text-body-1">Latvia</p>
							</FooterGroup>
							<FooterGroup title="Hours">
								<p className="text-body-1">Mon – Fri</p>
								<p className="text-body-1">8:00 – 19:00</p>
							</FooterGroup>
							<FooterGroup title="Language">
								<LinkPrimary href="/lv">Latviešu</LinkPrimary>
								<LinkPrimary href="/en">English</LinkPrimary>
							</FooterGroup>
						</div>
						<div data-footer-footnote className="grid grid-cols-2 grid-rows-2 grid-flow-col gap-y-micro gap-x-regular lg:flex lg:justify-between text-background/50 text-small">
							<RevealMask>
								<p>Rinalds Miļicins</p>
							</RevealMask>
							<RevealMask>
								<p>2026 © All Rights Reserved</p>
							</RevealMask>
							<RevealMask>
								<LinkSmall href="/cookies-privacy">Cookies & Privacy</LinkSmall>
							</RevealMask>
							<RevealMask>
								<LinkSmall href="https://alensbelikovs.com/" target="_blank">Designed by AB</LinkSmall>
							</RevealMask>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
