"use client"

import { useEffect, useRef, useState } from "react"
import TestimonialLines from "@/components2/typography/TestimonialLines"

const LAYOUT_CLASS_NAME = "grid grid-cols-12 gap-size-24 px-size-24"
const DEFAULT_SPACING_CLASS_NAME = "py-size-96"

export default function TestimonialBody(
	{ children, forceSpacing }:
		{ children: string; forceSpacing?: string })
{
	const contentRef = useRef<HTMLDivElement>(null)

	// Tracking and setting height for a smooth height transition
	const [height, setHeight] = useState<number>()

	useEffect(() => {
		const content = contentRef.current
		if (!content) return

		const measure = () => setHeight(content.getBoundingClientRect().height)
		measure()

		const observer = new ResizeObserver(measure)
		observer.observe(content)
		return () => observer.disconnect()
	}, [])

	return (
		<div className={`${LAYOUT_CLASS_NAME} ${forceSpacing ?? DEFAULT_SPACING_CLASS_NAME}`}>
			<div className="col-start-3 col-span-8">
				<div
					style={{ height }}
					className="overflow-hidden transition-all duration-300 ease-out"
				>
					<div ref={contentRef}>
						<TestimonialLines token={children}>
							<p className="text-size-64 font-serif text-center">{children}</p>
						</TestimonialLines>
					</div>
				</div>
			</div>
		</div>
	)
}
