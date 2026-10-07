"use client"
import { create } from "zustand"
import { sendGAEvent } from "@next/third-parties/google"

type ConsentType = "granted" | "denied"

type ConsentStoreType = {
	// null until a choice is made (or reopened), which shows the banner
	consent: ConsentType | null,
	// False until localStorage is read on mount, so the banner never flashes for returning visitors
	loaded: boolean,
	load: () => void,
	setConsent: (consent: ConsentType) => void,
	reopen: () => void
}

// Also read by the consent default script in the root layout
const KEY = "consent"

export const useConsentStore = create<ConsentStoreType>(set => ({
	consent: null,
	loaded: false,
	load: () => set({ consent: localStorage.getItem(KEY) as ConsentType | null, loaded: true }),
	setConsent: consent => {
		localStorage.setItem(KEY, consent)
		sendGAEvent("consent", "update", { analytics_storage: consent })
		set({ consent })
	},
	reopen: () => set({ consent: null }),
}))
