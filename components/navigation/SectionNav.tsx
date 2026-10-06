"use client"
import { useRef, useState } from "react"
import { useLenis } from "lenis/react"
import NavLink from "@/components/navigation/NavLink"
import { type SectionNavLink } from "@/components/navigation/SectionNavWrapper"
import { ScrollTrigger, useGSAP } from "@/utils/gsap"

// Sticky bar of section links that highlights the section in view
export default function SectionNav({ links }: { links: SectionNavLink[] }) {
	const navRef = useRef<HTMLElement>(null)
	const [activeId, setActiveId] = useState(links[0]?.id)
	// The section a click is scrolling to; sections passed on the way are ignored
	const pendingId = useRef<string | null>(null)
	const lenis = useLenis()

	useGSAP(() => {
		// Functions, so the line follows the bar's height on refresh
		const line = () => `${(navRef.current?.offsetHeight ?? 0) + 1}px`
		const sections = links.flatMap(({ id }) => {
			const element = document.getElementById(id)
			if (!element) return []
			return [{
				id,
				trigger: ScrollTrigger.create({
					trigger: element,
					start: () => `top ${line()}`,
					end: () => `bottom ${line()}`,
				}),
			}]
		})

		// Recomputed from trigger state on every scroll, so a missed toggle can't leave it out of step
		const update = () => {
			ScrollTrigger.update()
			const hit = sections.find(section => section.trigger.isActive)
			if (!hit) return
			if (pendingId.current) {
				if (hit.id !== pendingId.current) return
				pendingId.current = null
			}
			setActiveId(hit.id)
		}
		lenis?.on("scroll", update)

		// Any input ends a click's claim, in case its scroll never arrives
		const release = () => { pendingId.current = null }
		window.addEventListener("wheel", release, { passive: true })
		window.addEventListener("pointerdown", release, { passive: true })
		window.addEventListener("keydown", release)

		ScrollTrigger.refresh()
		update()

		return () => {
			lenis?.off("scroll", update)
			window.removeEventListener("wheel", release)
			window.removeEventListener("pointerdown", release)
			window.removeEventListener("keydown", release)
		}
	}, { dependencies: [links, lenis] })

	if (links.length === 0) return null

	// /80 rather than /50: the navbar's difference blend makes its lines vanish over half grey
	return (
		<nav
			ref={navRef}
			// Left/right arrows move focus along the links, wrapping at the ends
			onKeyDown={event => {
				if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
				const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
				const anchors = Array.from(navRef.current?.querySelectorAll("a") ?? [])
				const at = anchors.indexOf(document.activeElement as HTMLAnchorElement)
				if (step === 0 || at === -1) return
				event.preventDefault()
				anchors[(at + step + anchors.length) % anchors.length].focus()
			}}
			className="
				hidden lg:grid grid-cols-12 gap-size-24
				px-size-24 py-size-24 sticky top-0 left-0 z-10
				bg-background/80 backdrop-blur-2xl
			">
			<div className="col-span-10 col-start-2 flex flex-row gap-size-48">
				{links.map(({ id, label }) => (
					<NavLink
						key={id}
						href={`#${id}`}
						active={id === activeId}
						onClick={event => {
							const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
							if (modified || !lenis) return
							event.preventDefault()
							setActiveId(id)
							pendingId.current = id
							lenis.scrollTo(`#${id}`, { offset: -(navRef.current?.offsetHeight ?? 0) })
						}}>
						{label}
					</NavLink>
				))}
			</div>
		</nav>
	)
}
