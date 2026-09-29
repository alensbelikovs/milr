"use client"
import DetailList from "@/components/details/DetailList"
import NavLink from "@/components/navigation/NavLink"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

// tel: wants the number and nothing else — a dialler handed "+371 28 755 431" with its spaces in
// will not always take it. The schema stores the phone exactly as the editor typed it (see
// SCHEMA.md), which is the form worth PRINTING and the wrong form to link with, so the href is
// stripped to digits and a leading + while the text stays as typed.
//
// The + has to survive: without it the number is read as local, and this studio is reachable from
// outside Latvia.
const telHref = (phone: string) =>
	`tel:${phone.trim().startsWith("+") ? "+" : ""}${phone.replace(/\D/g, "")}`

// The studio's email and phone, from the site-wide singleton — the same pair the footer and the
// sidebar menu both show.
export default function DetalListContacts(
	{ className = "" }:
		{ className?: string }) {
	const information = useGeneralInformation(state => state.information)

	// Nothing to show until the singleton is saved for the first time. Null rather than an empty
	// list, so what is left is a gap rather than a heading standing over nothing.
	if (!information) return null

	return (
		<DetailList label="Contacts" className={className}>
			<li className="my-2">
				<NavLink active href={`mailto:${information.email}`}>{information.email}</NavLink>
			</li>
			<li className="my-2">
				<NavLink active href={telHref(information.phone)}>{information.phone}</NavLink>
			</li>
		</DetailList>
	)
}
