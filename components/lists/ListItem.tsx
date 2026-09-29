"use client"
import { useContext, useRef, type ComponentProps } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import TextLineSplit from "@/components/animation/TextLineSplit"
import ArrowRight from "@/components/icons/ArrowRight"
import { LIST_STAGGER, ListTimelineContext } from "@/components/lists/List"

// onClick is lifted off the <li> and onto the control inside it, so `rest` cannot carry a second,
// silently different one.
export default function ListItem(
	{ children, index, hovered, onClick, ...rest }:
	Omit<ComponentProps<"li">, "onClick"> &
	{ index: number; hovered: number | null; onClick?: () => void })
{
	const itemRef = useRef<HTMLLIElement>(null)

	// The list's timeline, and this row's place in it. Both the rule and the text are added at the
	// same offset, so a row arrives as one piece and the rows arrive LIST_STAGGER apart. Outside a
	// List there is no timeline, and the row falls back to a trigger of its own.
	const timeline = useContext(ListTimelineContext)
	const position = index * LIST_STAGGER

	// Nothing singled out means nothing dimmed: the rest of the list only recedes once the
	// reader has actually picked a row out of it.
	const dimmed = hovered === null || hovered === index ? "text-foreground" : "text-foreground/50"

	// The rule under the row draws itself across from the left as the row arrives, in step with the
	// text rising above it — the same timing, breakpoint and place in the timeline as the text, so
	// the two read as one entrance.
	//
	// The rule is an ::after, and GSAP cannot reach a pseudo-element — there is no node to hand it.
	// It tweens a custom property on the row instead, and the ::after reads its scale from that.
	// fromTo rather than from, because --line is never set on the row for GSAP to read a resting
	// value off: the 1 it rests at is the fallback inside the ::after's var().
	useGSAP(() => {
		const item = itemRef.current
		if (!item) return

		// 64rem is Tailwind's lg, the line TextLineSplit draws. Below it nothing sets --line, so the
		// fallback holds and the rule is simply there at full width.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			const draw = gsap.fromTo(item,
				{ "--line": 0 },
				{
					"--line": 1,
					duration: 1.2,
					ease: "expo.out",
					...(timeline ? {} : {
						scrollTrigger: {
							trigger: item,
							start: "top bottom",
							once: true,
						},
					}),
				})

			// Made inside this context and then moved into the timeline, so reverting the context
			// still finds it — and pulls it back out of the timeline on the way.
			timeline?.().add(draw, position)
		})

		// Unmounting, or dropping below lg, takes the inline --line off the row and the rule is back
		// at the fallback — full width, never stranded half drawn.
		return () => { mm.revert() }
	}, { dependencies: [timeline, position], scope: itemRef })

	return (
		<li
			ref={itemRef}
			// origin-left, so the rule grows out of the row's left edge rather than both ways from its
			// middle. Absolute, so it takes no height and the row measures the same as it did with a
			// border.
			className="group relative text-size-36 py-size-16 cursor-pointer
				after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-px
				after:bg-foreground/10 after:origin-left after:[transform:scaleX(var(--line,1))]"
			{...rest}>
			{/* A button rather than a link: the row opens a panel over the page instead of going
			    anywhere, so there is no href to give and nothing for a new tab to be opened on.
			    type="button" keeps it from submitting a form it might one day sit inside.
			    w-full and text-left because a button neither fills its row nor keeps its text
			    against the left edge on its own. */}
			<button
				type="button"
				onClick={onClick}
				className={`w-full text-left cursor-pointer flex justify-between items-center transition-colors duration-300 ${dimmed}`}>
				{/* A span, because a button's content has to be phrasing content — and a span is still
				    a block here: as a flex item it is blockified, so the lines cut inside it are
				    blocks a transform can move. */}
				<TextLineSplit as="span" timeline={timeline} position={position}>{children}</TextLineSplit>
				{/* The clipping box the arrow slides through: in from the left on hover, on out to the
				    right when the pointer leaves. overflow-hidden here rather than on the svg, because
				    the svg is what moves — clipped by itself, it would carry its own mask along.
				    flex, so the box is exactly the icon's size with no line-height gap under it. */}
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
