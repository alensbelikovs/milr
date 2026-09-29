import Section from "@/components/layout/Section"
import Heading72 from "@/components/typography/Heading72"
import ServicesList from "@/components/lists/ServicesList"
import { type ServiceType } from "@/types/ContentTypes"

const NAV_LABEL = "Services"

// The services the studio offers, which are Sanity `service` documents rather than a list kept in
// the repo. The same documents a work's detail table references — see SCHEMA.md, where a service
// carries its own picture and description precisely so this section can be built from them: what is
// listed here and what a work says it was delivered under can no longer disagree.
//
// ServiceType is that shape already, so nothing is mapped on the way in. Handed down from the page
// rather than fetched here, so it can be awaited alongside everything else the page needs.
export default function Services(
	{ services }: { services: ServiceType[] }) {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Heading72 serif={`( ${services.length} )`} className="mb-size-96">Services</Heading72>
			<ServicesList services={services} />
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
Services.navLabel = NAV_LABEL
