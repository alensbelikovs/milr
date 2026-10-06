"use client"
import { useLayoutEffect } from "react"
import { useTransitionStore } from "@/store/TransitionStore"

// Tells TransitionControl the page has mounted; a changed token signals again (e.g. new search params)
export default function PageReadySignal({ token }: { token?: string }) {
	useLayoutEffect(() => {
		useTransitionStore.getState().signalReady()
	}, [token])

	return null
}
