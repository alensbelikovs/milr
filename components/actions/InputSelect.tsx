"use client"

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
			<select
				className="
					group py-size-16 border-b
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
		</div>
	)
}
