"use client"
import { useLayoutEffect } from "react"
import { useTransitionStore } from "@/store/TransitionStore"

// Drop this into every page. Without it TransitionControl has nothing to wait on and the curtain
// sits on waitForPageReady's 10s failsafe.
export default function PageReadySignal() {
	// Fire exactly ONCE, on real mount. Empty deps are critical: when the page is an async server
	// component, this child's mount effect only runs after the page's data resolved and the
	// subtree committed. A pathname-derived effect would instead re-fire from the still-mounted
	// frozen page the moment the URL flips, resolving early.
	useLayoutEffect(() => {
		useTransitionStore.getState().signalReady()
	}, [])

	return null
}
