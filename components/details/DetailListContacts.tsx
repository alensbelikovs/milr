"use client"
import DetailList from "@/components/details/DetailList"
import { useSite } from "@/components/layout/SiteProvider"
import NavLink from "@/components/navigation/NavLink"
import telHref from "@/utils/telHref"

export default function DetailListContacts({ className = "" }: { className?: string }) {
	const { information, dict } = useSite()
	if (!information) return null

	const { email, phone } = information

	return (
		<DetailList label={dict.details.contacts} className={className}>
			<li className="my-2">
				<NavLink href={`mailto:${email}`}>{email}</NavLink>
			</li>
			<li className="my-2">
				<NavLink href={telHref(phone)}>{phone}</NavLink>
			</li>
		</DetailList>
	)
}
