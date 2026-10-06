"use client"
import ArrowDown from "@/components/icons/ArrowDown"

export default function InputSelect(
	{ id, label, placeholder, options, ...props }: {
		id: string,
		name: string,
		label: string,
		placeholder: string,
		options: Record<string, string>,
		value: string,
		onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
		required?: boolean
	}) {
	return (
		<div className="flex flex-col col-span-full">
			<label className="text-size-16" htmlFor={id}>{label}</label>
			<div className="grid">
				<select
					id={id}
					className="
						col-start-1 row-start-1
						appearance-none cursor-pointer
						py-size-16 pr-size-48 text-size-24
						border-b border-b-foreground/10
					"
					{...props}>
					{/* Empty and disabled, so `required` blocks submitting until a subject is picked */}
					<option value="" disabled>{placeholder}</option>
					{Object.entries(options).map(([key, option]) => (
						<option key={key} value={key}>{option}</option>
					))}
				</select>
				<ArrowDown
					dimensions={16}
					fill="currentColor"
					className="col-start-1 row-start-1 self-center justify-self-end pointer-events-none" />
			</div>
		</div>
	)
}
