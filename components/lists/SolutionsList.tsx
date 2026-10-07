"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import ListItem from "@/components/lists/ListItem"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { type Solution } from "@/types/CommonTypes"

const HIDDEN = "inset(100% 0% 0% 0%)"
const SHOWN = "inset(0% 0% 0% 0%)"
const REVEAL = { duration: 0.7, ease: "expo.out" }
const revealEase = gsap.parseEase(REVEAL.ease)

type Picture = { element: HTMLElement, enter: gsap.core.Tween, exit: gsap.core.Tween }

// The solutions list, with the hovered row's picture drawn open in a panel beside it
export default function SolutionsList({ solutions }: { solutions: Solution[] }) {
	const [hovered, setHovered] = useState<number | null>(null)
	const openSolution = useSidebarContentStore(state => state.openSolution)
	const scopeRef = useRef<HTMLDivElement>(null)
	const picturesRef = useRef<Map<number, Picture>>(new Map())
	const previousRef = useRef<number | null>(null)
	// Picture keys from the bottom of the stack to the top
	const stackRef = useRef<number[]>([])

	const restack = () => {
		stackRef.current.forEach((key, position) => {
			const picture = picturesRef.current.get(key)
			if (picture) picture.element.style.zIndex = String(position + 1)
		})
	}

	useGSAP(() => {
		const scope = scopeRef.current
		if (!scope) return

		const pictures = picturesRef.current
		pictures.clear()
		gsap.utils.toArray<HTMLElement>("[data-solution-picture]", scope).forEach(element => {
			// Opacity and scale tween 1 → 1 so a restart resets them after an interrupted exit
			const enter = gsap.fromTo(element,
				{ clipPath: HIDDEN, opacity: 1, scale: 1 },
				{ clipPath: SHOWN, opacity: 1, scale: 1, paused: true, ...REVEAL })

			// Closes from wherever the enter left the top edge, so an interrupted reveal doesn't snap open
			const top = () => 100 * (1 - revealEase(enter.progress()))
			const exit = gsap.fromTo(element,
				{ clipPath: () => `inset(${top()}% 0% 0% 0%)`, opacity: 1, scale: 1 },
				{
					clipPath: () => `inset(${top()}% 0% ${100 - top()}% 0%)`,
					opacity: 0,
					scale: 0.9,
					immediateRender: false,
					paused: true,
					...REVEAL,
				})

			pictures.set(Number(element.dataset.solutionPicture), { element, enter, exit })
		})

		stackRef.current = [...pictures.keys()]
		restack()
	}, { dependencies: [solutions], scope: scopeRef, revertOnUpdate: true })

	// The row left plays its exit, the row entered moves to the top of the stack and plays its enter
	useEffect(() => {
		const pictures = picturesRef.current
		const previous = previousRef.current
		previousRef.current = hovered
		if (previous === hovered) return

		if (previous !== null) {
			const picture = pictures.get(previous)
			picture?.exit.invalidate()
			void playTween(picture?.exit ?? null, { counterpart: picture?.enter })
		}
		if (hovered !== null) {
			const picture = pictures.get(hovered)
			stackRef.current = [...stackRef.current.filter(key => key !== hovered), hovered]
			restack()
			void playTween(picture?.enter ?? null, { counterpart: picture?.exit })
		}
	}, [hovered])

	return (
		<>
			<ul className="
				col-start-1 col-span-full
				md:col-start-2 md:col-span-10
				lg:col-start-2 lg:col-span-6
			">
				{solutions.map((solution, index) => (
					<ListItem
						key={solution.slug}
						index={index}
						delay={index * 0.05}
						hovered={hovered}
						onClick={() => openSolution(solution)}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						onFocus={() => setHovered(index)}
						onBlur={() => setHovered(null)}>
						{solution.title}
					</ListItem>
				))}
			</ul>
			<div className="
				col-start-9 col-span-3 self-end sticky bottom-6
				aspect-4/3 hidden lg:block
			">
				{/* isolate keeps the pictures' z-indexes in their own stacking context */}
				<div ref={scopeRef} className="relative isolate w-full h-full overflow-hidden">
					{/* Every solution gets a container, so a missing picture still shows the placeholder */}
					{solutions.map(({ slug, title, img }, index) => (
						<div
							key={slug}
							data-solution-picture={index}
							className="absolute inset-0 [clip-path:inset(100%_0_0_0)] bg-image-placeholder">
							{
								img &&
								<Image
									src={buildImageUrl(img.src, CARD)}
									alt={img.alt ?? title}
									fill
									sizes="25vw"
									quality={99}
									className="object-cover" />
							}
						</div>
					))}
				</div>
			</div>
		</>
	)
}
