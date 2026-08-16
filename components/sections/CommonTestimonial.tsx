"use client"

import Pagination from "@/components/common/Pagination"
import TextLineSplit from "@/components/common/TextLineSplit"
import TestimonialAuthorBox from "@/components/common/TestimonialAuthorBox"

export default function CommonTestimonial() {
	return (
		<section className="py-[144px] px-[24px] grid grid-cols-15 z-1 relative bg-background gap-y-[144px] gap-x-[24px]">
			<div className="col-start-2 col-span-12">
				<span className="text-heading-3 pointer-events-none block font-serif mb-[64px]">”</span>
				<TextLineSplit className="text-heading-2">
					"From the first discovery call to the last piece of furniture, everything felt considered. The space feels calm, but it's also incredibly functional — every corner has a purpose."
				</TextLineSplit>
			</div>
			<TestimonialAuthorBox src="/placeholder.png"/>
			<Pagination />
		</section>
	)
}