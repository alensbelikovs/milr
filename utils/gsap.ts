import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useTransitionStore } from "@/store/TransitionStore"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// Holds every GSAP animation until the page on screen has signalled ready
const syncToPageReady = (ready: boolean) => {
	if (ready) gsap.globalTimeline.resume()
	else gsap.globalTimeline.pause()
}
syncToPageReady(useTransitionStore.getState().pageReady)
useTransitionStore.subscribe((state, previous) => {
	if (state.pageReady !== previous.pageReady) syncToPageReady(state.pageReady)
})

export { gsap, useGSAP, ScrollTrigger, SplitText }
