"use client"
import { useRef, type ComponentProps } from "react"
import TextLineSplit from "@/components/animation/TextLineSplit"
import ArrowRight from "@/components/icons/ArrowRight"
import { gsap, ScrollTrigger, useGSAP } from "@/utils/gsap"

// A list row; once one row is hovered, the others dim. delay staggers its reveal.
export default function ListItem(
	{ children, index, hovered, delay = 0, onClick, ...props }: Omit<ComponentProps<"li">, "onClick"> & {
		index: number,
		hovered: number | null,
		delay?: number,
		onClick: () => void
	}) {
	const itemRef = useRef<HTMLLIElement>(null)

	// The rule is an ::after, so GSAP draws it through the --line custom property
	useGSAP(() => {
		const item = itemRef.current
		if (!item) return

		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const draw = gsap.fromTo(item,
				{ "--line": 0 },
				{ "--line": 1, duration: 1.2, ease: "expo.out", delay, paused: true })

			// restart(true) keeps the delay, which a trigger's own play() would skip
			ScrollTrigger.create({
				trigger: item,
				start: "top bottom",
				once: true,
				onEnter: () => { draw.restart(true) },
			})
		})

		return () => { mm.revert() }
	}, { dependencies: [delay], scope: itemRef })

	return (
		<li
			ref={itemRef}
			className="
				group relative text-size-36 py-size-16 cursor-pointer
				after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-px
				after:bg-foreground/10 after:origin-left after:[transform:scaleX(var(--line,1))]
			"
			{...props}>
			<button
				type="button"
				onClick={onClick}
				className={`
					w-full text-left cursor-pointer
					flex justify-between items-center
					transition-colors duration-300
					${hovered === null || hovered === index ? "text-foreground" : "text-foreground/50"}
				`}>
				<TextLineSplit as="span" delay={delay}>{children}</TextLineSplit>
				<span className="relative flex overflow-hidden">
					<ArrowRight
						dimensions={28}
						fill="currentColor"
						className="-translate-x-[120%] animate-arrow-out group-hover:animate-arrow-in" />
				</span>
			</button>
		</li>
	)
}
