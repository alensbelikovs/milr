"use client"
import { useConsentStore } from "@/store/ConsentStore"

// The client boundary for the footer, which reopens the consent banner
export default function ConsentSettingsButton({ children }: { children: React.ReactNode }) {
	const reopen = useConsentStore(state => state.reopen)

	return (
		<button type="button" className="cursor-pointer hover:underline" onClick={reopen}>
			{children}
		</button>
	)
}
