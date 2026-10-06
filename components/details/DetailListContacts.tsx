"use client"
import DetailList from "@/components/details/DetailList"
import NavLink from "@/components/navigation/NavLink"
import { useGeneralInformation } from "@/store/GeneralInformationStore"
import telHref from "@/utils/telHref"

export default function DetailListContacts({ className = "" }: { className?: string }) {
	const information = useGeneralInformation(state => state.information)
	if (!information) return null

	const { email, phone } = information

	return (
		<DetailList label="Contacts" className={className}>
			<li className="my-2">
				<NavLink href={`mailto:${email}`}>{email}</NavLink>
			</li>
			<li className="my-2">
				<NavLink href={telHref(phone)}>{phone}</NavLink>
			</li>
		</DetailList>
	)
}
