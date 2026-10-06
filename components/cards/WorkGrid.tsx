import WorkCard from "@/components/cards/WorkCard"
import { type WorkNarrow } from "@/types/WorkTypes"

export default function WorkGrid({ work }: { work: WorkNarrow[] }) {
	return (
		<div className="
			col-start-1 col-span-12
			md:col-start-2 md:col-span-10
			grid grid-cols-1 md:grid-cols-2
			gap-y-size-64 gap-x-size-24
		">
			{work.map((item, index) => (
				<WorkCard key={item.slug} work={item} delay={index % 2 ? 0.1 : 0} />
			))}
		</div>
	)
}
