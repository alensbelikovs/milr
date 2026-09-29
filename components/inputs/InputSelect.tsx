"use client"
import ArrowDown from "@/components/icons/ArrowDown"

export default function InputSelect(
	{ id, name, placeholder, label, options, value, onChange, required }:
		{
			id: string;
			name: string;
			placeholder: string;
			label: string;
			options: { [key: string]: string };
			value: string;
			onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
			required?: boolean;
		}) {
	return (
		<div className="flex flex-col col-span-full">
			<label className="text-size-16" htmlFor={id}>{label}</label>
			<div className="grid">
				<select
					className="
						col-start-1 row-start-1
						appearance-none cursor-pointer
						group py-size-16 pr-size-48 border-b
						border-b-foreground/10
						text-size-24
					"
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					required={required}
				>
					{/* Disabled, so once a real subject is picked the prompt cannot be chosen again.
					    Its empty value is what lets `required` block the submit until then. */}
					<option value="" disabled>{placeholder}</option>
					{Object.entries(options).map(([key, label]) => (
						<option key={key} value={key}>{label}</option>
					))}
				</select>
				{/* pointer-events-none, so a click on the arrow falls through to the select under it.
				    currentColor, so it takes whatever colour the field's text is. */}
				<ArrowDown
					dimensions={16}
					fill="currentColor"
					className="col-start-1 row-start-1 self-center justify-self-end pointer-events-none" />
			</div>
		</div>
	)
}
