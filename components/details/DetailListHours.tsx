"use client"
import DetailList from "@/components/details/DetailList"
import { useSite } from "@/components/layout/SiteProvider"

export default function DetailListHours({ className = "" }: { className?: string }) {
	const { information, dict } = useSite()
	if (!information) return null

	// Days are stored as lowercase slugs
	const days: Record<string, string> = dict.days

	const { workFromDay, workToDay, workHourFrom, workHourTo } = information.hours

	return (
		<DetailList label={dict.details.hours} className={`md:text-right ${className}`}>
			<li className="my-2">
				{days[workFromDay] ?? workFromDay} – {days[workToDay] ?? workToDay}
			</li>
			<li className="my-2">{workHourFrom} – {workHourTo}</li>
		</DetailList>
	)
}
