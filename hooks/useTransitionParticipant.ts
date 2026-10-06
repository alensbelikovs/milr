"use client"
import { useLayoutEffect } from "react"
import { useTransitionStore } from "@/store/TransitionStore"
import { type TransitionParticipantMethodsType } from "@/types/TransitionTypes"

export function useTransitionParticipant(key: string, methods: TransitionParticipantMethodsType) {
	// Registered once: the first render's methods object is also what the cleanup unregisters
	useLayoutEffect(() => {
		const { registerParticipant, unregisterParticipant } = useTransitionStore.getState()
		registerParticipant(key, methods)
		return () => unregisterParticipant(key, methods)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
