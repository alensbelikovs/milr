"use client"
import { Children, ReactNode, useId, useRef, useState } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import BodyButton from "@/components/buttons/BodyButton"
import ArrowDown from "@/components/icons/ArrowDown"

// A column of body copy that, given more than one child, opens collapsed below lg: the column is cut
// to a fixed height, a gradient lies over its bottom edge, and "Read more" on the gradient opens it.
// At lg and up the column has the room, and every child is simply there.
//
// Opening is the column's own height growing to fit its content, with overflow still hidden, so the
// copy is uncovered by the box rather than moving in. That is the only motion below lg — the text
// reveals are off there (see TextBlockReveal).
//
// The collapse is done in classes rather than by reading the width, so the server and the first
// client render agree and a window dragged across lg is right without a re-render.
//
// fadeClassName is the colour the gradient fades to, which has to be whatever is behind the column —
// the page's background by default, the band's on the dark Process section.
//
// collapse={false} opts out: every child is there at every width, however many there are.
export default function Body18Container(
	{ children, className = "", fadeClassName = "to-background", collapse = true }:
		{ children: ReactNode; className?: string; fadeClassName?: string; collapse?: boolean })
{
	const collapsible = collapse && Children.count(children) > 1
	const [expanded, setExpanded] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const fadeRef = useRef<HTMLDivElement>(null)
	const id = useId()
	const { contextSafe } = useGSAP({ scope: rootRef })

	// Wrapped at click time rather than during render: the ref lint rule reads a ref-reading function
	// handed to a call in render as a read in render. Either way the tween joins the component's
	// context, and is killed with it if the column unmounts mid-open.
	const expand = () => contextSafe(() => {
		const root = rootRef.current
		const fade = fadeRef.current
		if (!root || !fade) return

		// Pressed once is enough: the button is on its way out from here on.
		gsap.set(fade, { pointerEvents: "none" })

		// From the height the class gives it to the height its content asks for. The inline height
		// wins over the class while it runs; overflow stays hidden until the end, so what is not yet
		// inside the box stays out of sight.
		gsap.timeline({ onComplete: () => setExpanded(true) })
			.fromTo(root,
				{ height: "16rem" },
				{ height: "auto", duration: 1.2, ease: "expo.out", immediateRender: false })
			.to(fade, { yPercent: 120, duration: 1.2, ease: "expo.out" }, 0.1)
	})()

	const collapsed = collapsible && !expanded

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
				${className}`}>
			{ children }
			{
				collapsed &&
					<div
						ref={fadeRef}
						className={`
							lg:hidden absolute inset-x-0 bottom-0
							flex flex-col justify-end h-size-192
							bg-linear-to-b from-transparent ${fadeClassName} to-70%`}>
						<BodyButton
							icon={<ArrowDown fill="currentColor" dimensions={12} />}
							className=""
							onClick={expand}
							aria-expanded={false}
							aria-controls={id}>
							Read more
						</BodyButton>
					</div>
			}
		</div>
	)
}
