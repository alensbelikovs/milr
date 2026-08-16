"use client"
import { useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"
import { useTransitionParticipant } from "@/hooks/useTransitionParticipant"
import { playTween } from "@/utils/playTween"

export default function HeroSceneOverlay({ title }: { title: string }) {
	const scopeRef = useRef<HTMLDivElement>(null)
	const dimmerRef = useRef<HTMLDivElement>(null)
	const headingRef = useRef<HTMLDivElement>(null)

	const dimmerEnterTween = useRef<gsap.core.Tween>(null)
	const headingEnterTween = useRef<gsap.core.Tween>(null)

	useGSAP(() => {
		dimmerEnterTween.current = gsap.fromTo(dimmerRef.current, 
			{ opacity: 0 },
			{ opacity: 0.4, duration: 1.5, paused: true }
		)
		headingEnterTween.current = gsap.fromTo(headingRef.current, 
			{ yPercent: 100, scale: 0.9 },
			{ yPercent: 0, scale: 1, duration: 1.5, ease: "expo.out", paused: true }
		)
	}, { scope: scopeRef })

	useTransitionParticipant('heroSceneOverlay', {
		dimmerIn: () => playTween(dimmerEnterTween.current),
		headingIn: () => playTween(headingEnterTween.current)
	})

	return (
		<div 
			className="
				absolute inset-0 z-1
				grid grid-cols-15 gap-[24px] p-[24px] grid-rows-12
			"
			ref={scopeRef}
		>
			<div ref={dimmerRef} className="dimmer absolute inset-0"/>
			<div className="col-start-2 col-span-13 row-start-10 row-span-full flex justify-start items-start">
				<div className="overflow-hidden">
					<h1 ref={headingRef} className="text-heading-3 leading-[1.2]! text-background p-[2px]">{ title }</h1>
				</div>
			</div>
		</div>
	)
}