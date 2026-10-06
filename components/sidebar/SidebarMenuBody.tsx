"use client"
import Link from "next/link"
import FadeReveal from "@/components/animation/FadeReveal"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
import DetailList from "@/components/details/DetailList"
import DetailListAddress from "@/components/details/DetailListAddress"
import DetailListContacts from "@/components/details/DetailListContacts"
import DetailListHours from "@/components/details/DetailListHours"
import DetailListSocials from "@/components/details/DetailListSocials"
import LanguageSelect from "@/components/inputs/LanguageSelect"
import { STATIC_ROUTES } from "@/lib/routes"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// The detail lists fade in a row at a time, each row a step after everything above it
const FIRST_ROW_DELAY = STATIC_ROUTES.length * 0.05 + 0.05
const SECOND_ROW_DELAY = FIRST_ROW_DELAY + 0.05

export default function SidebarMenuBody() {
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)

	return (
		<div className="
			grid grid-cols-6
			px-size-24 gap-x-size-24 gap-y-size-96 pt-size-96 pb-size-24
		">
			<DetailList label="Navigation" action={<LanguageSelect />} className="col-start-2 col-span-4">
				{STATIC_ROUTES.map((route, index) => (
					<li className="my-2" key={route.href}>
						<TextMaskReveal delay={index * 0.05}>
							<Link
								href={route.href}
								className="text-size-36 hover:underline"
								// Modified clicks open elsewhere, so the menu stays open
								onClick={event => {
									const modified = event.metaKey || event.ctrlKey
										|| event.shiftKey || event.altKey
									if (!modified) closeSidebar()
								}}>
								{route.label}
							</Link>
						</TextMaskReveal>
					</li>
				))}
			</DetailList>
			<div className="col-span-2 col-start-2">
				<FadeReveal delay={FIRST_ROW_DELAY} />
				<DetailListContacts />
			</div>
			<div className="col-span-2 hidden lg:block">
				<FadeReveal delay={FIRST_ROW_DELAY} />
				<DetailListHours />
			</div>
			<div className="col-span-2 col-start-2">
				<FadeReveal delay={SECOND_ROW_DELAY} />
				<DetailListSocials />
			</div>
			<div className="col-span-2 hidden lg:block">
				<FadeReveal delay={SECOND_ROW_DELAY} />
				<DetailListAddress />
			</div>
		</div>
	)
}
