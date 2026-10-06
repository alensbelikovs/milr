"use client"
import { BODY_SECONDARY } from "@/components/buttons/BodyLinkSecondary"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { type Solution } from "@/types/CommonTypes"

// Looks like a link, but opens the solution in the sidebar instead of navigating
export default function SolutionButton({ solution }: { solution: Solution }) {
	const openSolution = useSidebarContentStore(state => state.openSolution)

	return (
		<button type="button" className={BODY_SECONDARY} onClick={() => openSolution(solution)}>
			{solution.title}
		</button>
	)
}
