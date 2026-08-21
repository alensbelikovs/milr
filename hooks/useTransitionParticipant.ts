"use client"

import { useLayoutEffect } from "react"
import { TransitionParticipantMethodsType } from "@/types/TransitionTypes"
import { useTransitionStore } from "@/store/TransitionStore"

export function useTransitionParticipant(key: string, methods: TransitionParticipantMethodsType) {
	// Empty deps on purpose: `methods` is rebuilt every render, and re-registering on each one would
	// churn the store for nothing. The object captured on the first render is the one registered AND
	// the one handed to the cleanup, which is what lets the store tell this participant's own removal
	// from a same-key registration that replaced it.
	useLayoutEffect(() => {
		const { registerParticipant, unregisterParticipant } = useTransitionStore.getState()
		registerParticipant(key, methods)
		return () => unregisterParticipant(key, methods)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
