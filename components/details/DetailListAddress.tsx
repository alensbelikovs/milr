"use client"
import DetailList from "@/components/details/DetailList"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

export default function DetailListAddress({ className = "" }: { className?: string }) {
	const information = useGeneralInformation(state => state.information)
	if (!information) return null

	const { streetName, streetNumber, postalCode, city, country } = information.address

	return (
		<DetailList label="Address" className={`text-right ${className}`}>
			<li className="my-2">{streetName} {streetNumber}</li>
			<li className="my-2">{postalCode}, {city}</li>
			<li className="my-2">{country}</li>
		</DetailList>
	)
}
