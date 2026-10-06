"use client"
import FixedButton from "@/components/buttons/FixedButton"
import { type SectionNavLink } from "@/components/navigation/SectionNavWrapper"
import { SIDEBAR_ID } from "@/components/sidebar/Sidebar"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

// SectionNav below lg: a "Jump To" button that opens the links in the sidebar
export default function SectionNavMobile({ links }: { links: SectionNavLink[] }) {
	const isOpen = useSidebarContentStore(state => state.sidebarContent !== null)
	const openSectionNav = useSidebarContentStore(state => state.openSectionNav)
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)

	if (links.length === 0) return null

	return (
		<FixedButton
			onClick={() => isOpen ? closeSidebar() : openSectionNav(links)}
			aria-expanded={isOpen}
			aria-controls={SIDEBAR_ID}>
			Jump To
		</FixedButton>
	)
}
