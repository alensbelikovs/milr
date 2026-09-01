"use client"

import { useRef } from "react"
import Link from "next/link"
import { gsap, useGSAP } from "@/utils/gsap"

export default function BodyLink(
	{ href, children, target="_self" }:
		{ href: string; children: React.ReactNode; target?: string })
{
	const linkRef = useRef<HTMLAnchorElement>(null)
	const textRef = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		// The link itself is the mask, so the span can travel up into it.
		gsap.fromTo(textRef.current,
			{ yPercent: 100, scale: 0.9 },
			{
				yPercent: 0,
				scale: 1,
				duration: 1.5,
				ease: "expo.out",
				scrollTrigger: {
					trigger: linkRef.current,
					start: "top bottom",
					once: true,
				},
			}
		)
	}, { scope: linkRef })

	return (
		<div>
			<Link
				ref={linkRef}
				href={href}
				target={target}
				className="
					inline-block
					overflow-hidden
					text-size-16
					group
					"
			>
				<span
					ref={textRef}
					className="
					inline-block
					group-hover:underline
					group-hover:underline-offset-4">
					{children}
				</span>
			</Link>
		</div>
	)
}
