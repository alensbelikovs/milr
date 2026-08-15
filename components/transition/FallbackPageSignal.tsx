"use client"
import { useLayoutEffect } from "react"
import { useTransitionStore } from "@/store/TransitionStore"

export default function FallbackPageSignal() {
	useLayoutEffect(() => {
		useTransitionStore.getState().signalReady()
	}, [])

	return null
}
