import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useTransitionStore } from "@/store/TransitionStore"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// The global guard: nothing GSAP drives moves until the page on screen has signalled ready.
//
// Every tween, timeline and delayed call is a child of the global timeline, so pausing it holds all
// of them at once — the ones already running, and any made or triggered while it is paused, which
// start from their first frame when it resumes rather than having played out unseen. Done here,
// where gsap itself is handed out, so no component has to remember to ask.
//
// Only time is held. An immediate render still happens — a fromTo or a from still puts its element
// in its starting state the moment it is made — so a picture or a line held back by the guard is
// held out of sight, not left at its resting place. ScrollTrigger keeps measuring and firing too;
// what it starts simply waits.
//
// The curtain is a GSAP tween like any other, so TransitionControl opens the gate before it asks the
// curtain to move (see there).
const syncToPageReady = (ready: boolean) => {
	if (ready) gsap.globalTimeline.resume()
	else gsap.globalTimeline.pause()
}
syncToPageReady(useTransitionStore.getState().pageReady)
useTransitionStore.subscribe((state, previous) => {
	if (state.pageReady !== previous.pageReady) syncToPageReady(state.pageReady)
})
export { gsap, useGSAP, ScrollTrigger, SplitText }