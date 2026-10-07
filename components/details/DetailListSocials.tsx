"use client"
import DetailList from "@/components/details/DetailList"
import { useSite } from "@/components/layout/SiteProvider"
import NavLink from "@/components/navigation/NavLink"

export default function DetailListSocials({ className = "" }: { className?: string }) {
	const { information, dict } = useSite()
	if (!information || information.socials.length === 0) return null

	return (
		<DetailList label={dict.details.socials} className={className}>
			{information.socials.map(social => (
				<li className="my-2" key={social._key}>
					<NavLink target="_blank" href={social.url}>{social.title}</NavLink>
				</li>
			))}
		</DetailList>
	)
}
