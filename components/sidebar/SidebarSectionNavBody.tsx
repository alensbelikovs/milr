"use client"
import Link from "next/link"
import { useLenis } from "lenis/react"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
import BodyButton from "@/components/buttons/BodyButton"
import DetailList from "@/components/details/DetailList"
import Cross from "@/components/icons/Cross"
import { useSite } from "@/components/layout/SiteProvider"
import { type SectionNavLink } from "@/components/navigation/SectionNavWrapper"
import SidebarFooter from "@/components/sidebar/SidebarFooter"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// The page's section links, for mobile "Jump To"
export default function SidebarSectionNavBody({ links }: { links: SectionNavLink[] }) {
	const { dict } = useSite()
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const lenis = useLenis()

	return (
		<nav
			aria-label={dict.common.sections}
			className="
				grid grid-cols-6 grid-rows-[1fr_auto] min-h-full
				px-size-24 gap-x-size-24 pt-size-96
			">
			<DetailList label={dict.common.sections} className="col-start-2 col-span-4">
				{links.map(({ id, label }, index) => (
					<li className="my-2" key={id}>
						<TextMaskReveal onMount delay={index * 0.05}>
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
			<SidebarFooter>
				<BodyButton
					color="bg-foreground text-background"
					className="w-full"
					icon={<Cross dimensions={12} fill="currentColor" />}
					onClick={closeSidebar}>
					{dict.common.close}
				</BodyButton>
			</SidebarFooter>
		</nav>
	)
}
