"use client"
import DetailList from "@/components/details/DetailList"
import { useSite } from "@/components/layout/SiteProvider"

export default function DetailListAddress({ className = "" }: { className?: string }) {
	const { information, dict } = useSite()
	if (!information) return null

	const { streetName, streetNumber, postalCode, city, country } = information.address

	return (
		<DetailList label={dict.details.address} className={`md:text-right ${className}`}>
			<li className="my-2">{streetName} {streetNumber}</li>
			<li className="my-2">{postalCode}, {city}</li>
			<li className="my-2">{country}</li>
		</DetailList>
	)
}
