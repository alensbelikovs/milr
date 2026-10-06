"use client"
import DetailList from "@/components/details/DetailList"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

// Days are stored as lowercase slugs
const DAY_LABELS: Record<string, string> = {
	monday: "Mon",
	tuesday: "Tue",
	wednesday: "Wed",
	thursday: "Thu",
	friday: "Fri",
	saturday: "Sat",
	sunday: "Sun",
}

export default function DetailListHours({ className = "" }: { className?: string }) {
	const information = useGeneralInformation(state => state.information)
	if (!information) return null

	const { workFromDay, workToDay, workHourFrom, workHourTo } = information.hours

	return (
		<DetailList label="Hours" className={`text-right ${className}`}>
			<li className="my-2">
				{DAY_LABELS[workFromDay] ?? workFromDay} – {DAY_LABELS[workToDay] ?? workToDay}
			</li>
			<li className="my-2">{workHourFrom} – {workHourTo}</li>
		</DetailList>
	)
}
