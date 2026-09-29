"use client"
import NextImage, { type ImageProps } from "next/image"
import { useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// next/image that resolves into view instead of appearing. Everything about it is next/image's —
// props go straight through — except that it holds the picture back until the file is actually
// decoded and then plays it in.
//
// A component rather than a hook or a class, because the animation and the load event it waits on
// belong to the same element, and this is the level at which nothing else can be driving that
// element's transform. Wrapping one in a box that is itself being animated — a parallax layer, say
// — is then safe: two transforms, two elements.
export default function Image({ className = "", onLoad, ...rest }: ImageProps) {
	const imageRef = useRef<HTMLImageElement>(null)

	// Built once and kept, so the load handler has something to play rather than a reason to build
	// another. loaded covers the other order: a picture out of the browser cache finishes before any
	// layout effect runs, and the handler that fired then has to leave word behind.
	const revealRef = useRef<gsap.core.Tween | null>(null)
	const loadedRef = useRef(false)

	// useGSAP owns the teardown: the tween is created inside its context, so unmounting kills it and
	// puts the element's inline styles back.
	useGSAP(() => {
		if (!imageRef.current) return

		// paused, and a fromTo — which renders its from state the moment it is made, even paused. That
		// is what keeps the first painted frame from being the finished one.
		revealRef.current = gsap.fromTo(imageRef.current,
			{ scale: 1.2, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 1.2, ease: "expo.out", paused: true })

		if (loadedRef.current) revealRef.current.play()
	})

	return (
		<NextImage
			ref={imageRef}
			className={className}
			// Lazy by default, which is also what makes the reveal worth having: the request does not
			// start until the picture is near the viewport, so it almost always resolves in front of
			// someone. In rest, not fixed, so a caller with a hero to paint can still say eager.
			loading="lazy"
			// Taken off rest and called by hand, so a caller can listen for the load without
			// replacing the handler that plays the reveal.
			onLoad={event => {
				loadedRef.current = true
				revealRef.current?.play()
				onLoad?.(event)
			}}
			{...rest} />
	)
}
