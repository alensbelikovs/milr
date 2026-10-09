"use client"
import { Children, useId, useRef, useState } from "react"
import BodyButton from "@/components/buttons/BodyButton"
import ArrowDown from "@/components/icons/ArrowDown"
import { useSite } from "@/components/layout/SiteProvider"
import { gsap, useGSAP } from "@/utils/gsap"

// A column of body copy that starts collapsed below lg when it has more than one child.
// collapse={false} opts out.
export default function Body18Container(
	{ children, className = "", collapse = true }: {
		children: React.ReactNode,
		className?: string,
		collapse?: boolean
	}) {
	const { dict } = useSite()
	const [expanded, setExpanded] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const fadeRef = useRef<HTMLDivElement>(null)
	const id = useId()
	const { contextSafe } = useGSAP({ scope: rootRef })
	const collapsed = collapse && Children.count(children) > 1 && !expanded

	const expand = () => contextSafe(() => {
		if (!rootRef.current || !fadeRef.current) return

		gsap.set(fadeRef.current, { pointerEvents: "none" })
		gsap.timeline({ onComplete: () => setExpanded(true) })
			.fromTo(rootRef.current,
				{ height: "16rem" },
				{ height: "auto", duration: 1.2, ease: "expo.out", immediateRender: false })
			.to(fadeRef.current, { yPercent: 120, duration: 1.2, ease: "expo.out" }, 0.1)
	})()

	return (
		<div
			ref={rootRef}
			id={id}
			className={`
				row-start-2 relative
				flex flex-col gap-size-48 mt-size-96
				col-start-1 col-span-12
				sm:col-start-6 sm:col-span-6
				md:col-start-7 md:col-span-5
				lg:col-start-7 lg:col-span-4
				xl:col-start-7 xl:col-span-3
				${collapsed ? "max-lg:h-[16rem] max-lg:overflow-hidden" : ""}
				${className}
			`}>
			{children}
			{
				collapsed &&
				<div
					ref={fadeRef}
					className="
						lg:hidden absolute inset-x-0 bottom-0
						flex flex-col justify-end h-size-192
						bg-linear-to-b from-transparent to-background to-70%
					">
					<BodyButton
						icon={<ArrowDown fill="currentColor" dimensions={12} />}
						onClick={expand}
						aria-expanded={false}
						aria-controls={id}>
						{dict.common.readMore}
					</BodyButton>
				</div>
			}
		</div>
	)
}
