import { type WorkListType } from "@/types/ContentTypes"
import WorkCard from "@/components/cards/WorkCard"

// Kept beside the class that sets it, so the two cannot drift: it is what turns a card's place in
// the list into its place in a row, which is what the reveal staggers by.
const COLUMNS = 2

export default function WorkGrid(
	{ work }:
		{ work: WorkListType[] })
{
	return (
		<div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-y-size-64 gap-x-size-24">
			{work.map((item, i) => (
				<WorkCard key={item.slug} work={item} index={i % COLUMNS} />
			))}
		</div>
	)
}
