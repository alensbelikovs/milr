"use client"

import ProjectGrid from "@/components/common/ProjectGrid"

export default function HomeFeaturedWork() {
	return (
		<section className="py-[144px] px-[24px] relative z-1 bg-background">
			<div className="grid grid-cols-15 gap-[24px]">
				<div className="col-start-2 col-span-13 flex justify-between mb-[96px]">
					<h2 className="text-heading-2">My Best Work</h2>
					<h2 className="text-heading-2">5+</h2>
				</div>
			</div>
			<ProjectGrid />
		</section>
	)
}