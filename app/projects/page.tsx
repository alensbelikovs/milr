import PageReadySignal from "@/components/transition/PageReadySignal"

export default function ProjectsPage() {
	return (
		<div className="min-h-screen grid grid-cols-12 gap-[24px] p-[24px] pt-[35vh]">
			<h1 className="col-start-2 col-span-10 text-heading-2">Projects</h1>
			<p className="col-start-2 col-span-6 text-body-2">
				Placeholder page. Long enough to scroll, so the curtain can be tested against a
				page that is not sitting at the top when you navigate away from it.
			</p>
			<div className="col-start-2 col-span-10 h-[150vh]" />
			<p className="col-start-2 col-span-6 text-body-1">End of Projects.</p>
			<PageReadySignal />
		</div>
	)
}
