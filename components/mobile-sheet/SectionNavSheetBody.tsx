"use client"
import type { MouseEvent } from "react"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { useMobileSheetStore } from "@/store/MobileSheetStore"
import MobileSheetBody from "@/components/mobile-sheet/MobileSheetBody"
import DetailList from "@/components/details/DetailList"
import BodyButton from "@/components/buttons/BodyButton"
import Cross from "@/components/icons/Cross"
import type { SectionNavLink } from "@/components/navigation/SectionNavWrapper"

// SectionNav's links, for the mobile sheet. Laid out and sized like the sidebar menu's Navigation list.
export default function SectionNavSheetBody({ links }: { links: SectionNavLink[] }) {
	const close = useMobileSheetStore(state => state.close)
	const lenis = useLenis()

	function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
		// Let cmd/ctrl/shift-click open a new tab or window natively.
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		if (!lenis) return
		event.preventDefault()

		// Started here, before the scroll, rather than left to the sheet's scroll lock. start()
		// resets Lenis, and a reset stops whatever it is animating — so the lock's cleanup, running
		// after this render, would cancel the scroll this click has just begun. Started now, that
		// cleanup's own start() finds Lenis already running and does nothing.
		lenis.start()
		close()
		lenis.scrollTo(`#${id}`)
	}

	return (
		<MobileSheetBody
			as="nav"
			aria-label="Sections"
			footer={
				<BodyButton
					className="w-full"
					color="bg-foreground text-background"
					icon={<Cross dimensions={16} fill="currentColor" />}
					onClick={close}>
					Close
				</BodyButton>
			}>
			<div className="col-start-2 col-span-4">
				<DetailList label="Sections">
					{links.map(({ id, label }) => (
						<li className="my-2" key={id}>
							<Link
								className="text-size-36 hover:underline"
								href={`#${id}`}
								onClick={event => handleClick(event, id)}>
								{label}
							</Link>
						</li>
					))}
				</DetailList>
			</div>
		</MobileSheetBody>
	)
}
