"use client"
import { useRef } from "react"
import Link from "next/link"
import { gsap, useGSAP } from "@/utils/gsap"

type LinkPrimaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean
}

// The underline's two poses
const HIDDEN = { scaleX: 0 }
const DRAWN = { scaleX: 1 }

const DURATION = 0.2
const UNDERLINE = "absolute left-0 bottom-[0.2em] w-full h-px bg-current pointer-events-none [transform:scaleX(0)]"

export default function LinkPrimary({ href, children, className = "", target = "_self", disabled }: LinkPrimaryProps) {
	const rootRef = useRef<HTMLAnchorElement>(null)
	const lineRef = useRef<HTMLDivElement>(null)

	const drawTimelineRef = useRef<gsap.core.Timeline | null>(null)
	const clearTimelineRef = useRef<gsap.core.Timeline | null>(null)

	// INITIAL HOOK — both timelines built once, paused. Each re-seeds its origin on restart, so
	// the two can hand off to each other any number of times. immediateRender: false leaves the
	// class's scaleX(0) on screen until a hover actually runs one, so nothing flashes on mount.
	useGSAP(() => {
		drawTimelineRef.current = gsap.timeline({ paused: true })
			.set(lineRef.current, { transformOrigin: "left" })
			.fromTo(lineRef.current,
				HIDDEN,
				{
					...DRAWN,
					immediateRender: false,
					ease: "power2.out",
					duration: DURATION
				}
			)
		clearTimelineRef.current = gsap.timeline({ paused: true })
			.set(lineRef.current, { transformOrigin: "right" })
			.fromTo(lineRef.current,
				DRAWN,
				{
					...HIDDEN,
					immediateRender: false,
					ease: "power2.in",
					duration: DURATION
				}
			)
	}, { scope: rootRef })

	const handleEnter = () => {
		if (disabled) return
		clearTimelineRef.current?.pause()
		drawTimelineRef.current!.restart()
	}

	const handleLeave = () => {
		if (disabled) return
		drawTimelineRef.current?.pause()
		clearTimelineRef.current!.restart()
	}

	return (
		<Link
			ref={rootRef}
			href={href}
			target={target}
			aria-disabled={disabled}
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			onFocus={handleEnter}
			onBlur={handleLeave}
			className={`relative inline-block text-body-1 aria-disabled:opacity-30 aria-disabled:cursor-not-allowed ${className}`.trim()}>
			{children}
			<div ref={lineRef} aria-hidden="true" className={UNDERLINE} />
		</Link>
	)
}
