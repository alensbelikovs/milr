"use client"
import { createContext, useContext, useState } from "react"
import { useStore } from "zustand/react"
import { createStore, type StoreApi } from "zustand/vanilla"
import { type GeneralInformation } from "@/types/CommonTypes"

// Built per request with the server data, so the first render has it on both server and client
type GeneralInformationStoreType = {
	information: GeneralInformation | null
}

const GeneralInformationContext = createContext<StoreApi<GeneralInformationStoreType> | null>(null)

export function GeneralInformationProvider(
	{ children, information }: { children: React.ReactNode, information: GeneralInformation | null }) {
	const [store] = useState(() => createStore<GeneralInformationStoreType>(() => ({ information })))

	return (
		<GeneralInformationContext value={store}>
			{children}
		</GeneralInformationContext>
	)
}

export function useGeneralInformation<T>(selector: (state: GeneralInformationStoreType) => T): T {
	const store = useContext(GeneralInformationContext)
	if (!store) throw new Error("useGeneralInformation used outside GeneralInformationProvider")
	return useStore(store, selector)
}
