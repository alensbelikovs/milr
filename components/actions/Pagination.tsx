import PaginationStepButton from "@/components/actions/PaginationStepButton"

export default function Pagination() {
	return (
		<div className="col-start-5 col-span-4 flex flex-col justify-center gap-size-24">
			<div className="flex items-center w-full justify-center">
				<PaginationStepButton step={1} />
				<PaginationStepButton step={2} />
				<PaginationStepButton step={3} />
			</div>
			<div className="w-full flex justify-between gap-size-48">
				<PaginationFlipButton>Prev</PaginationFlipButton>
				<PaginationFlipButton>Next</PaginationFlipButton>
			</div>
		</div>
	)
}

const PaginationFlipButton = ({ children }: { children: React.ReactNode }) => {
	return (
		<button className="text-size-36 hover:underline cursor-pointer">
			{ children }
		</button>
	)
}
