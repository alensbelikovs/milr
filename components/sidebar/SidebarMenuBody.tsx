"use client"
import { useRef, useState, type MouseEvent } from "react"
import Link from "next/link"
import { gsap, useGSAP } from "@/utils/gsap"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { STATIC_ROUTES } from "@/lib/routes"
import DetailList from "@/components/details/DetailList"
import LanguageSelect from "@/components/inputs/LanguageSelect"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
import DetailListHours from "@/components/details/DetailListHours"
import DetailListAddress from "@/components/details/DetailListAddress"
import DetailListSocials from "@/components/details/DetailListSocials"
import DetailListContacts from "@/components/details/DetailListContacts"

// How far apart consecutive items start.
const STAGGER = 0.1

// The detail lists sit two to a row — see the grid below — and a row starts as one: Contacts with
// Hours, then Socials with Address a step later. Kept beside the stagger it feeds, and has to change
// with the grid if the lists are ever laid out differently.
const DETAILS_PER_ROW = 2

// The same travel and timing the page's own reveals use, so the menu arrives the way the rest of
// the site does.
const REVEAL = { duration: 1.2, ease: "expo.out" }

// The menu arrives as one cascade — the links rising out of their masks one after another, then
// the detail lists fading up in the same rhythm. It leaves with no animation of its own: the
// sidebar fades whatever it is showing as the panel slides away.
//
// The sidebar mounts this fresh for every open (see its contentKey), so the entrance is simply
// played once, on mount.
export default function SidebarMenuBody() {
	const scopeRef = useRef<HTMLDivElement>(null)

	// The way in, which the links add themselves to. Made on first ask rather than during render,
	// the same as List's: the links' effects run BEFORE this component's — children commit first —
	// so they have to be able to bring it into being, and a timeline made during render would also
	// be made on the server for every request. dispose clears the slot, so a remount gets a fresh
	// one rather than a killed one that will not play.
	const [entrance] = useState(() => {
		let timeline: gsap.core.Timeline | null = null
		return {
			get: () => timeline ??= gsap.timeline({ paused: true }),
			dispose: () => {
				timeline?.kill()
				timeline = null
			},
		}
	})

	useGSAP(() => {
		const scope = scopeRef.current
		if (!scope) return

		// 64rem is Tailwind's lg, the same line every reveal on the site draws. Below it the menu is
		// simply there, and the sidebar's own slide is the whole of the transition.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// Read from the DOM rather than kept in ref arrays: nothing here is cut or re-rendered,
			// so the query is the list, in the order it is drawn.
			const rows = gsap.utils.toArray<HTMLElement>("[data-menu-row]", scope)
			const details = gsap.utils.toArray<HTMLElement>("[data-menu-detail]", scope)

			// Straight after the last link, in the same rhythm, so the two groups read as one run —
			// a row of lists at a time: a list shares its start with the one beside it.
			entrance.get().add(
				gsap.fromTo(details, { opacity: 0 }, {
					opacity: 1,
					...REVEAL,
					stagger: index => Math.floor(index / DETAILS_PER_ROW) * STAGGER,
				}),
				rows.length * STAGGER)
		})

		// Last, once the links have added themselves — their effects ran before this one — and the
		// lists have been added above. Below lg the timeline is empty and this plays nothing.
		entrance.get().play()

		return () => {
			mm.revert()
			entrance.dispose()
		}
	}, { scope: scopeRef })

	return (
		<div
			ref={scopeRef}
			className="grid grid-cols-6
			px-size-24 gap-x-size-24
			gap-y-size-96 pt-size-96 pb-size-24">
			<Navigation timeline={entrance.get} />
			{/* Each list in a wrapper of its own, which is what fades — and which now holds the grid
			    placement, since it is the wrapper that sits in the grid. */}
			<div data-menu-detail className="col-span-2 col-start-2"><DetailListContacts /></div>
			<div data-menu-detail className="col-span-2 hidden lg:block"><DetailListHours /></div>
			<div data-menu-detail className="col-span-2 col-start-2"><DetailListSocials /></div>
			<div data-menu-detail className="col-span-2 hidden lg:block"><DetailListAddress /></div>
		</div>
	)
}

const Navigation = ({ timeline }: { timeline: () => gsap.core.Timeline }) => {
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)

	// Closes on the click itself rather than waiting for the navigation it starts, so the panel is
	// already sliding away while the next page loads — and a link to the page already on screen,
	// which navigates nowhere, still dismisses it. Modified clicks are left alone: cmd/ctrl/shift
	// open the page somewhere else, and the reader is staying where they are, menu and all.
	const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		closeSidebar()
	}

	return (
		<div className="col-start-2 col-span-4">
			{/* The language pair rides on the label's line, pushed to the far end of it — see
			    DetailList's action slot. */}
			<DetailList label="Navigation" action={<LanguageSelect />}>
				{
					STATIC_ROUTES.map((route, index) => (
						<li data-menu-row className="my-2" key={route.href}>
							<TextMaskReveal timeline={timeline} position={index * STAGGER}>
								<Link
									target="_self"
									className="text-size-36 hover:underline"
									onClick={onLinkClick}
									href={route.href}>{route.label}</Link>
							</TextMaskReveal>
						</li>
					))
				}
			</DetailList>
		</div>
	)
}
