import { gsap } from "@/utils/gsap"

// Every transition participant is built the same way: a paused animation — a fromTo pair, or a
// whole timeline — that TransitionControl restarts and awaits. This is the driver they all share.
// Typed on gsap.core.Animation, the base both Tween and Timeline extend, so either can be passed.
//
// Restarts `tween` and resolves once it lands, pausing its `counterpart` first so a half-finished
// enter can't fight the exit that interrupted it. The onComplete is cleared on the way out —
// without that, any other restart of the same tween (a scroll-driven one, say) would fire a stale
// resolve from an earlier transition.
//
// `includeDelay` re-arms the tween's delay, which restart() drops by default. Only wanted by
// participants whose delay is load-bearing (a loader kept off screen on fast transitions).
export const playTween = (
	tween: gsap.core.Animation | null,
	{ counterpart, includeDelay = false }: {
		counterpart?: gsap.core.Animation | null
		includeDelay?: boolean
	} = {}
) => new Promise<void>(resolve => {
	if (!tween) return resolve()
	counterpart?.pause()
	tween.eventCallback("onComplete", () => {
		tween.eventCallback("onComplete", null)
		resolve()
	})
	tween.restart(includeDelay)
})
