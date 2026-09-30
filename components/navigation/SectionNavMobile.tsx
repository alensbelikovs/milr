"use client"
import { useMobileSheetStore } from "@/store/MobileSheetStore"
import FixedButton from "@/components/buttons/FixedButton"
import { MOBILE_SHEET_ID } from "@/components/mobile-sheet/MobileSheet"
import SectionNavSheetBody from "@/components/mobile-sheet/SectionNavSheetBody"
import type { SectionNavLink } from "@/components/navigation/SectionNavWrapper"

// SectionNav for below lg, where a bar of links across the page has no room: a "Jump To" button that
// opens the same links in the mobile sheet. The sheet, its slide and its locks all live in MobileSheet;
// this only decides what goes in it.
export default function SectionNavMobile({ links }: { links: SectionNavLink[] }) {
	const isOpen = useMobileSheetStore(state => state.content !== null)
	const open = useMobileSheetStore(state => state.open)
	const close = useMobileSheetStore(state => state.close)

	if (links.length === 0) return null

	return (
		<FixedButton
			onClick={() => isOpen ? close() : open(<SectionNavSheetBody links={links} />)}
			aria-expanded={isOpen}
			aria-controls={MOBILE_SHEET_ID}>
			Jump To
		</FixedButton>
	)
}
