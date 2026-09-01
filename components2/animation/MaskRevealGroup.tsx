"use client"

import { useRef } from "react"
import type { ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import { REVEAL_ITEM_SELECTOR } from "@/components2/animation/MaskRevealGroupItem"

// One ScrollTrigger for every MaskRevealGroupItem beneath it, however deeply they are nested.
//
// MaskReveal and BodyLink each carry a trigger of their own, which is right for a heading or a lone
// link but wrong for a column of them: a label, its value and the line under it would each decide
// separately when they had entered the viewport, and the column would arrive in pieces at whatever
// order their tops happened to cross the line. Here the group is the trigger and the stagger is the
// order, so the whole column reads as one movement.
//
// Collected by attribute rather than by cloning children, so the items can sit at any depth — a
// label in one grid cell and three address lines in another, all still part of the same run.
//
// Same reveal as MaskReveal, and deliberately so: an item here and a MaskReveal elsewhere on the
// page should not look like two different animations.
export default function MaskRevealGroup(
	{ children, className, stagger = 0.05 }:
		{ children: ReactNode; className?: string; stagger?: number })
{
	const groupRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const group = groupRef.current
		if (!group) return

		const items = gsap.utils.toArray<HTMLElement>(REVEAL_ITEM_SELECTOR, group)
		if (items.length === 0) return

		gsap.fromTo(items,
			{ yPercent: 100, scale: 0.9 },
			{
				yPercent: 0,
				scale: 1,
				duration: 1.5,
				ease: "expo.out",
				stagger,
				scrollTrigger: {
					trigger: group,
					start: "top bottom",
					once: true,
				},
			}
		)
	}, { scope: groupRef })

	return <div ref={groupRef} className={className}>{children}</div>
}
