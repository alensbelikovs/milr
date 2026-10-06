import { gsap } from "@/utils/gsap"

// Restarts a paused animation and resolves when it completes, pausing its counterpart first
export const playTween = (
	tween: gsap.core.Animation | null,
	{ counterpart }: { counterpart?: gsap.core.Animation | null } = {}
) => new Promise<void>(resolve => {
	if (!tween) return resolve()
	counterpart?.pause()
	tween.eventCallback("onComplete", () => {
		tween.eventCallback("onComplete", null)
		resolve()
	})
	tween.restart()
})
