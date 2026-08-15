"use client"
import { useRef } from "react"
import Link from "next/link"
import { gsap, useGSAP } from "@/utils/gsap"

type LinkSecondaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean
}

// The underline's two poses
const AT_REST = { scaleX: 1 }
const CLEARED = { scaleX: 0 }

const DURATION = 0.15

const UNDERLINE = "absolute left-0 bottom-[0.2em] w-full h-px bg-current pointer-events-none"

export default function LinkSecondary({ href, children, className = "", target = "_self", disabled }: LinkSecondaryProps) {
	const rootRef = useRef<HTMLAnchorElement>(null)
	const lineRef = useRef<HTMLDivElement>(null)

	const sweepTweenRef = useRef<gsap.core.Timeline | null>(null)

	useGSAP(() => {
		sweepTweenRef.current = gsap.timeline({ paused: true })
			.set(lineRef.current, { transformOrigin: "right" })
			.fromTo(lineRef.current,
				AT_REST,
				{
					...CLEARED,
					immediateRender: false,
					ease: "power2.inOut",
					duration: DURATION
				}
			)
			.set(lineRef.current, { transformOrigin: "left" })
			.fromTo(lineRef.current,
				CLEARED,
				{
					...AT_REST,
					immediateRender: false,
					ease: "power2.outIn",
					duration: DURATION
				}
			)
	}, { scope: rootRef })

	const handleEnter = () => {
		if (disabled) return
		sweepTweenRef.current!.restart()
	}

	return (
		<Link
			ref={rootRef}
			href={href}
			target={target}
			aria-disabled={disabled}
			onMouseEnter={handleEnter}
			onFocus={handleEnter}
			className={`relative inline-block text-body-1 opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 aria-disabled:opacity-30 aria-disabled:cursor-not-allowed ${className}`.trim()}>
			{children}
			<div ref={lineRef} aria-hidden="true" className={UNDERLINE} />
		</Link>
	)
}
