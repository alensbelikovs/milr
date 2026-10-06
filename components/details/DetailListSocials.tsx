"use client"
import DetailList from "@/components/details/DetailList"
import NavLink from "@/components/navigation/NavLink"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

export default function DetailListSocials({ className = "" }: { className?: string }) {
	const information = useGeneralInformation(state => state.information)
	if (!information || information.socials.length === 0) return null

	return (
		<DetailList label="Socials" className={className}>
			{information.socials.map(social => (
				<li className="my-2" key={social._key}>
					<NavLink target="_blank" href={social.url}>{social.title}</NavLink>
				</li>
			))}
		</DetailList>
	)
}
