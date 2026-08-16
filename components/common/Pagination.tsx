"use client"
import PaginationPageButton from "@/components/common/PaginationPageButton"

export default function Pagination() {
	return (
		<div className="col-span-6 col-start-9 flex flex-col gap-[96px]">
			<div className="flex">
				<PaginationPageButton number="1" active />
				<PaginationPageButton number="2" />
				<PaginationPageButton number="3" />
			</div>
			<div className="flex justify-between">
				<button className="py-[12px] hover:underline hover:underline-offset-4 text-heading-2 cursor-pointer">
					Prev
				</button>
				<button className="py-[12px] cursor-pointer hover:underline hover:underline-offset-4 text-heading-2">
					Next
				</button>
			</div>
		</div>
	)
}