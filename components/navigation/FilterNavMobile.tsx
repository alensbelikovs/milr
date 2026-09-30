"use client"
import { useMobileSheetStore } from "@/store/MobileSheetStore"
import FixedButton from "@/components/buttons/FixedButton"
import { MOBILE_SHEET_ID } from "@/components/mobile-sheet/MobileSheet"
import FilterSheetBody from "@/components/mobile-sheet/FilterSheetBody"
import { type WorkCategory, type WorkType } from "@/types/ContentTypes"

// FilterNav for below lg: a "Filters" button that opens the choices in the mobile sheet. See
// SectionNavMobile, which this mirrors.
export default function FilterNavMobile(
	props: {
		categories: WorkCategory[]
		types: WorkType[]
		activeCategory: string | null
		activeType: string | null
	}
) {
	const isOpen = useMobileSheetStore(state => state.content !== null)
	const open = useMobileSheetStore(state => state.open)
	const close = useMobileSheetStore(state => state.close)

	return (
		<FixedButton
			onClick={() => isOpen ? close() : open(<FilterSheetBody {...props} />)}
			aria-expanded={isOpen}
			aria-controls={MOBILE_SHEET_ID}>
			Filters
		</FixedButton>
	)
}
