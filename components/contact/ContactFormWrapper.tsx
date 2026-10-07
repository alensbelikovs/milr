"use client"
import { useRef, useState } from "react"
import { useLenis } from "lenis/react"
import ContactForm from "@/components/contact/ContactForm"
import ContactResult from "@/components/contact/ContactResult"
import Section from "@/components/layout/Section"
import { gsap, useGSAP } from "@/utils/gsap"
import { playTween } from "@/utils/playTween"
import { type ContactStatusType } from "@/types/ContactTypes"

const FADE = { duration: 0.4, ease: "power2.out", paused: true, immediateRender: false }

// Fades the hero and form out, then the result in.
// The client boundary, so Contact stays a server component.
export default function ContactFormWrapper({ hero, navId }: { hero: React.ReactNode, navId: string }) {
	const [status, setStatus] = useState<ContactStatusType | "idle">("idle")
	const containerRef = useRef<HTMLDivElement>(null)
	const fadeOutRef = useRef<gsap.core.Tween | null>(null)
	const fadeInRef = useRef<gsap.core.Tween | null>(null)
	const lenis = useLenis()

	useGSAP(() => {
		fadeOutRef.current = gsap.fromTo(containerRef.current, { opacity: 1 }, { opacity: 0, ...FADE })
		fadeInRef.current = gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, ...FADE })
	}, { scope: containerRef })

	useGSAP(() => {
		if (status !== "idle") fadeInRef.current?.restart()
	}, { dependencies: [status], scope: containerRef })

	// Back to the top while nothing is visible, before the result mounts
	async function handleResult(next: ContactStatusType) {
		await playTween(fadeOutRef.current, { counterpart: fadeInRef.current })
		if (lenis) lenis.scrollTo(0, { immediate: true })
		else window.scrollTo(0, 0)
		setStatus(next)
	}

	// Without the hero, the result keeps its offset below the nav
	return (
		<div ref={containerRef}>
			{status === "idle" && hero}
			<Section noTopPadding navId={navId} className={status === "idle" ? "" : "mt-size-96"}>
				<div className="col-span-full">
					{
						status === "idle"
							? <ContactForm onResult={handleResult} />
							: <ContactResult status={status} />
					}
				</div>
			</Section>
		</div>
	)
}
