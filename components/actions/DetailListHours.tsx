import DetailList from "@/components/general/DetailList"

export default function DetailListHours(
	{ className }:
		{ className?: string }) {
	return (
		<DetailList label="Hours" className={`text-right ${className}`}>
			<li className="my-2">Mon – Fri</li>
			<li className="my-2">8:00 – 19:00</li>
		</DetailList>
	)
}
