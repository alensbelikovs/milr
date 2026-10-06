"use client"
import Link from "next/link"
import { useLenis } from "lenis/react"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
import DetailList from "@/components/details/DetailList"
import { type SectionNavLink } from "@/components/navigation/SectionNavWrapper"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// The page's section links, for mobile "Jump To"
export default function SidebarSectionNavBody({ links }: { links: SectionNavLink[] }) {
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const lenis = useLenis()

	return (
		<nav aria-label="Sections" className="grid grid-cols-6 px-size-24 gap-x-size-24 py-size-96">
			<DetailList label="Sections" className="col-start-2 col-span-4">
				{links.map(({ id, label }, index) => (
					<li className="my-2" key={id}>
						<TextMaskReveal delay={index * 0.05}>
							<Link
								href={`#${id}`}
								className="text-size-36 hover:underline"
								onClick={event => {
									const modified = event.metaKey || event.ctrlKey
										|| event.shiftKey || event.altKey
									if (modified || !lenis) return
									event.preventDefault()
									// Started first, or the scroll lock's cleanup would cancel the scroll
									lenis.start()
									closeSidebar()
									lenis.scrollTo(`#${id}`)
								}}>
								{label}
							</Link>
						</TextMaskReveal>
					</li>
				))}
			</DetailList>
		</nav>
	)
}
