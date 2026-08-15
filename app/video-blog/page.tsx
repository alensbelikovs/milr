import PageReadySignal from "@/components/transition/PageReadySignal"

export default function VideoBlogPage() {
	return (
		<>
			<div className="min-h-screen grid grid-cols-12 gap-[24px] p-[24px] pt-[35vh]">
				<h1 className="col-start-2 col-span-10 text-heading-2">Video Blog</h1>
				<p className="col-start-2 col-span-6 text-body-2">
					Placeholder page.
				</p>
				<PageReadySignal />
			</div>
		</>
	)
}
