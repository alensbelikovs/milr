import FallbackPageSignal from "@/components/transition/FallbackPageSignal"

export default function NotFound() {
	return (
		<main className="min-h-screen grid grid-cols-12 gap-[24px] p-[24px] pt-[35vh]">
			<h1 className="col-start-2 col-span-10 text-heading-2">Not found</h1>
			<p className="col-start-2 col-span-6 text-body-2">
				This page does not exist.
			</p>
			<FallbackPageSignal />
		</main>
	)
}
