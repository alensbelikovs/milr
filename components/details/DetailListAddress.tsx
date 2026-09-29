"use client"
import DetailList from "@/components/details/DetailList"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

// Where the studio is, from the site-wide singleton, across the three lines a postal address is read
// in: the street, the postcode and city together, then the country.
//
// streetNumber is text rather than a number in the schema, so "56", "12A" and "5-7" all arrive as
// typed and are printed as typed.
export default function DetalListAddress(
	{ className = "" }:
		{ className?: string }) {
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
