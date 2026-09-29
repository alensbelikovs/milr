"use client"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { BODY_SECONDARY } from "@/components/buttons/BodyLinkSecondary"
import { type WorkServiceType } from "@/types/ContentTypes"

// A service in a work's detail table. It looks exactly like the links beside it — same classes, from
// the same constant — and behaves differently on purpose: a service has no page to go to, so pressing
// it opens the sidebar on that service instead of navigating. A button is what says that in HTML.
//
// The panel it opens is the one the services list opens, and openService is what it opens through: a
// service carries the title, the description and the picture that panel shows, so there is nothing to
// add here. The document the reference resolves to is the same shared vocabulary the Services section
// lists, which is why one opener serves both.
export default function ServiceButton({ service }: { service: WorkServiceType }) {
	const openService = useSidebarContentStore(state => state.openService)

	return (
		<button type="button" className={BODY_SECONDARY} onClick={() => openService(service)}>
			{ service.title }
		</button>
	)
}
