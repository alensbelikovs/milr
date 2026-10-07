"use client"
import { useEffect } from "react"
import BodyButton from "@/components/buttons/BodyButton"
import { useSite } from "@/components/layout/SiteProvider"
import LocaleLink from "@/components/navigation/LocaleLink"
import { useConsentStore } from "@/store/ConsentStore"

// Asks for analytics consent until a choice is made; the footer can reopen it
export default function ConsentBanner() {
	const { consent: copy } = useSite().dict
	const { consent, loaded, load, setConsent } = useConsentStore()

	useEffect(load, [load])

	if (!loaded || consent) return null

	return (
		<div
			role="region"
			aria-label={copy.link}
			className="
				fixed bottom-size-24 inset-x-size-24 md:left-auto md:w-md z-16
				flex flex-col gap-size-16 p-size-24 rounded-sm
				bg-background/80 backdrop-blur-2xl text-size-16
			">
			<p>
				{copy.text}{" "}
				<LocaleLink className="underline hover:no-underline" href="/cookies-privacy">{copy.link}</LocaleLink>
			</p>
			<div className="flex gap-size-16">
				<BodyButton className="flex-1" onClick={() => setConsent("denied")}>{copy.decline}</BodyButton>
				<BodyButton className="flex-1" onClick={() => setConsent("granted")}>{copy.accept}</BodyButton>
			</div>
		</div>
	)
}
