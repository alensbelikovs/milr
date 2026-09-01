"use client"

import { useRef } from "react"
import type { ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

export default function FadeReveal(
	{ as = "div", children, className, translateY = "20vh" }:
		{
			as?: keyof React.JSX.IntrinsicElements
			children: ReactNode
			className?: string
			// Distance the element travels up into place. Any CSS length GSAP can
			// resolve; pass 0 for a reveal that only fades.
			translateY?: string | number
		})
{
	const elementRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		gsap.fromTo(elementRef.current,
			{ opacity: 0, y: translateY },
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: "expo.out",
				scrollTrigger: {
					trigger: elementRef.current,
					start: "top bottom",
					once: true,
				},
			}
		)
	}, { scope: elementRef })

	// A JSX tag rather than createElement, because the ref lint rule cannot see that createElement
	// does not read a ref it is handed: to it, any function taking a ref might read .current during
	// render. As a JSX attribute the ref is understood for what it is, and React assigns it after
	// mount as always. The cast is what lets one ref type serve every tag `as` allows.
	const Tag = as as unknown as React.FC<{ ref?: React.Ref<HTMLElement>, className?: string, children?: ReactNode }>

	return <Tag ref={elementRef} className={className}>{children}</Tag>
}
