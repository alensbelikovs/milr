
import React from "react"

export default function PaginationStepButton({ step }: { step: number }) {
	return (
		<button className="font-serif p-size-16 text-size-18 hover:underline cursor-pointer">{ step }</button>
	)
}
