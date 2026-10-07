"use client"
import { useEffect, useRef } from "react"
import BodyButton from "@/components/buttons/BodyButton"
import { useSite } from "@/components/layout/SiteProvider"
import LocaleLink from "@/components/navigation/LocaleLink"
import { useConsentStore } from "@/store/ConsentStore"
import { gsap, useGSAP } from "@/utils/gsap"

// Asks for analytics consent until a choice is made; the footer can reopen it
export default function ConsentBanner() {
	const { consent: copy } = useSite().dict
	const { consent, loaded, load, setConsent } = useConsentStore()
	const bannerRef = useRef<HTMLDivElement>(null)

	useEffect(load, [load])

	// Rises in like BlockSlideInReveal, on mount rather than on scroll
	useGSAP(() => {
		if (!bannerRef.current) return
		gsap.fromTo(bannerRef.current,
			{ y: window.innerHeight * 0.25, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1.2, ease: "expo.out" })
	}, { dependencies: [loaded, consent] })

	if (!loaded || consent) return null

	return (
		<div
			ref={bannerRef}
			role="region"
			aria-label={copy.heading}
			className="
				fixed bottom-size-24 inset-x-size-24 md:left-auto md:w-xl z-16
				flex flex-col gap-size-24 p-size-24 rounded-sm
				bg-background/80 backdrop-blur-2xl
			">
			<h2 className="text-size-24">{copy.heading}</h2>
			<p className="font-serif text-size-16 text-foreground/50">{copy.text}</p>
			<LocaleLink
				className="self-start font-serif text-size-16 underline hover:no-underline"
				href="/cookies-privacy">
				{copy.link}
			</LocaleLink>
			<div className="flex gap-size-16">
				<BodyButton className="flex-1" onClick={() => setConsent("granted")}>{copy.accept}</BodyButton>
				<BodyButton className="flex-1" onClick={() => setConsent("denied")}>{copy.decline}</BodyButton>
			</div>
		</div>
	)
}
