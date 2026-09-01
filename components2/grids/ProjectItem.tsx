import type { ProjectListType } from "@/types/ContentTypes"
import PlaceholderPattern from "@/components2/common/PlaceholderPattern"

export default function ProjectItem(
	{ project }:
	{ project?: ProjectListType }
) {

	return (
		<div className="col-span-6 grid grid-cols-6 gap-size-24">
			<div className="relative overflow-hidden col-span-5 aspect-4/3">
				<PlaceholderPattern />
			</div>
			<div className="col-span-1 flex items-end">
				<p className="text-size-14">
					MR-000
				</p>
			</div>
		</div>
	)
}
