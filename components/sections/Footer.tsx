"use client"
import { STATIC_ROUTES } from "@/lib/routes"
import DetailList from "@/components/details/DetailList"
import Link from "next/link"
import DetailListHours from "@/components/details/DetailListHours"
import DetailListContacts from "@/components/details/DetailListContacts"
import DetailListAddress from "@/components/details/DetailListAddress"
import DetailListSocials from "@/components/details/DetailListSocials"

import { ScrollTrigger, useGSAP, gsap } from "@/utils/gsap"
import { useEffect, useRef } from "react"
import { useLenis } from "lenis/react"
import { useTransitionStore } from "@/store/TransitionStore"

export default function Footer() {
	const scopeRef = useRef<HTMLElement>(null)
	const translateRef = useRef<HTMLDivElement>(null)
	const lenis = useLenis()
	const committedUrl = useTransitionStore(state => state.committedUrl)

	useGSAP(() => {
		if (!scopeRef.current || !translateRef.current) return
		ScrollTrigger.create({
			trigger: scopeRef.current,
			start: "top bottom",

			// "bottom bottom", not "bottom top". The footer is the last thing in the document, so
			// the furthest it can ever travel is its own bottom edge meeting the viewport's — a
			// scroll that puts it at the viewport TOP does not exist. Asking for one stretches the
			// range past the end of the page and strands the scrub half-played, which leaves the
			// content parked permanently above where it belongs.
			end: "bottom bottom",

			// ease: "none" because scroll IS the playhead here. Any other ease makes the content
			// travel at a different rate than the wheel that is driving it.
			animation: gsap.fromTo(translateRef.current,
				{ yPercent: -100 },
				{ yPercent: 0, ease: "none" }),
			scrub: true,
		})
	}, { scope: scopeRef })

	// Lenis drives scroll from its own rAF loop; without this ScrollTrigger reads a position one
	// frame stale and the content lags the scroll moving it. Kept out of the useGSAP above so the
	// trigger is built once rather than torn down and rebuilt the frame Lenis resolves.
	useEffect(() => {
		if (!lenis) return
		lenis.on("scroll", ScrollTrigger.update)
		return () => { lenis.off("scroll", ScrollTrigger.update) }
	}, [lenis])

	// The footer lives in the layout, so it survives every page swap that changes the document
	// height under it — and start/end measured against the old height describe a page that is no
	// longer there. Keyed on committedUrl rather than usePathname so the remeasure happens once the
	// incoming page is actually on screen and has a height worth measuring — and on the URL rather
	// than the pathname, because a filter or page change on /work swaps in a grid of a different
	// height without moving the pathname.
	useEffect(() => {
		ScrollTrigger.refresh()
	}, [committedUrl])

	return (
		<footer ref={scopeRef} className="overflow-hidden relative min-h-screen text-background bg-foreground grid-standard gap-y-size-96 py-size-96">
			<div ref={translateRef} className="flex flex-col gap-size-96 col-start-2 col-span-10">
				<DetailList className="col-start-2 col-span-10 self-start" label="Navigation">
					{STATIC_ROUTES.map((item) => (
						<li className="my-1.5" key={item.label}>
							<Link className="text-size-24 hover:underline" href={item.href}>
								{item.label}
							</Link>
						</li>
					))}
				</DetailList>
				<div className="col-start-2 col-span-10 gap-size-24 flex mt-size-96">
					<DetailListContacts className="w-full text-background"/>
					<DetailListSocials className="w-full text-background"/>
					<DetailListAddress className="w-full text-background"/>
					<DetailListHours className="w-full text-background"/>
				</div>
				<div className="pt-size-24 text-body-16 text-background/50 flex w-full gap-size-24">
					<p className="w-full">Rinalds Miļicins</p>
					<p className="w-full">Milr Studio</p>
					<p className="w-full text-right">
						<Link
							className="hover:underline"
							href="/cookies-privacy">
							Cookies & Privacy
						</Link>
					</p>
					<p className="w-full text-right">
						<Link
							className="hover:underline"
							target="_blank"
							href="/cookies-privacy">
							Designed by AB
						</Link>
					</p>
				</div>
			</div>
		</footer>
	)
}
