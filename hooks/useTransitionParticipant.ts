"use client"

import { useLayoutEffect } from "react"
import { TransitionParticipantMethodsType } from "@/types/TransitionTypes"
import { useTransitionStore } from "@/store/TransitionStore"

export function useTransitionParticipant(key: string, methods: TransitionParticipantMethodsType) {
	useLayoutEffect(() => {
		const { registerParticipant, unregisterParticipant } = useTransitionStore.getState()
		registerParticipant(key, methods)
		return () => unregisterParticipant(key)
	}, [])
}
