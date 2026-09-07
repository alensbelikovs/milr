import DetailList from "@/components/general/DetailList"

export default function DetalListAddress(
	{ className }:
		{ className?: string }) {
	return (
		<DetailList label="Address" className={`text-right ${className}`}>
			<li className="my-2">Aleksandra Čaka 56</li>
			<li className="my-2">LV-1011, Rīga</li>
			<li className="my-2">Latvia</li>
		</DetailList>
	)
}
