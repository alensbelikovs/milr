"use client"
import NextImage, { type ImageProps } from "next/image"
import { useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// next/image that scales and fades in once the file has loaded
export default function Image({ onLoad, ...props }: ImageProps) {
	const imageRef = useRef<HTMLImageElement>(null)
	const revealRef = useRef<gsap.core.Tween | null>(null)
	// Cached images can load before the effect runs
	const loadedRef = useRef(false)

	useGSAP(() => {
		if (!imageRef.current) return

		revealRef.current = gsap.fromTo(imageRef.current,
			{ scale: 1.2, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 1.2, ease: "expo.out", paused: true })

		if (loadedRef.current) revealRef.current.play()
	})

	return (
		<NextImage
			ref={imageRef}
			loading="lazy"
			onLoad={event => {
				loadedRef.current = true
				revealRef.current?.play()
				onLoad?.(event)
			}}
			{...props} />
	)
}
