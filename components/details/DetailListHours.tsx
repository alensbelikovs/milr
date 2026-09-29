"use client"
import DetailList from "@/components/details/DetailList"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

// Days come out of Sanity as lowercase slugs — monday … sunday — never as the labels the Studio
// shows (see SCHEMA.md), so the short forms the list prints are decided here. A lookup rather than a
// slice of the slug, because "Thu" is not the first three letters of "thursday" in every language
// this may one day be written in, and a missing key should be visible rather than silently wrong.
const DAY_LABELS: Record<string, string> = {
	monday: "Mon",
	tuesday: "Tue",
	wednesday: "Wed",
	thursday: "Thu",
	friday: "Fri",
	saturday: "Sat",
	sunday: "Sun",
}

// When the studio is open, from the site-wide singleton.
//
// The times are printed exactly as stored: zero-padded HH:MM, so 8am reads 08:00. That is the value
// an editor typed and the one the Studio validates as a range, and trimming the zero here would put
// this component in the business of parsing times to say the same thing.
export default function DetailListHours(
	{ className = "" }:
		{ className?: string }) {
	const information = useGeneralInformation(state => state.information)

	if (!information) return null

	const { workFromDay, workToDay, workHourFrom, workHourTo } = information.hours

	// The slug itself if it is not one of the seven, which is a state the schema does not allow but
	// which reads as the data being wrong rather than as a blank line.
	const from = DAY_LABELS[workFromDay] ?? workFromDay
	const to = DAY_LABELS[workToDay] ?? workToDay

	return (
		<DetailList label="Hours" className={`text-right ${className}`}>
			<li className="my-2">{from} – {to}</li>
			<li className="my-2">{workHourFrom} – {workHourTo}</li>
		</DetailList>
	)
}
