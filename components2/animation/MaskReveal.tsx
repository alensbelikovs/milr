"use client"

import { useRef } from "react"
import type { ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

export default function MaskReveal(
	{ as = "div", children, className }:
		{ as?: keyof React.JSX.IntrinsicElements; children: ReactNode; className?: string })
{
	const maskRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		// The outer tag is the mask, so the span can travel up into it. Same reveal
		// as TextLineReveal, minus the split: the whole content moves as one line.
		gsap.fromTo(contentRef.current,
			{ yPercent: 100, scale: 0.9 },
			{
				yPercent: 0,
				scale: 1,
				duration: 1.5,
				ease: "expo.out",
				scrollTrigger: {
					trigger: maskRef.current,
					start: "top bottom",
					once: true,
				},
			}
		)
	}, { scope: maskRef })

	// A JSX tag rather than createElement, because the ref lint rule cannot see that createElement
	// does not read a ref it is handed: to it, any function taking a ref might read .current during
	// render. As a JSX attribute the ref is understood for what it is, and React assigns it after
	// mount as always. The cast is what lets one ref type serve every tag `as` allows.
	const Tag = as as unknown as React.FC<{ ref?: React.Ref<HTMLElement>, className?: string, children?: ReactNode }>

	return (
		<Tag ref={maskRef} className={`overflow-hidden ${className ?? ""}`}>
			{/* inline-block so the span accepts a transform and can be clipped. */}
			<span ref={contentRef} className="inline-block">
				{children}
			</span>
		</Tag>
	)
}
