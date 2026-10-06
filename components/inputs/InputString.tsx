"use client"

// A labelled text field; textarea swaps the input for a textarea
export default function InputString(
	{ id, label, textarea = false, type = "text", ...props }: {
		id: string,
		name: string,
		label: string,
		placeholder: string,
		value: string,
		onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
		onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
		textarea?: boolean,
		type?: React.HTMLInputTypeAttribute,
		required?: boolean,
		autoComplete?: string
	}) {
	const className = `
		group border-b border-b-foreground/10 text-size-24
		${textarea ? "pt-size-16 pb-size-48 resize-y scrollbar-background" : "py-size-16"}
	`

	return (
		<div className="flex flex-col col-span-full">
			<label className="text-size-16" htmlFor={id}>{label}</label>
			{
				textarea
					? <textarea id={id} rows={4} className={className} {...props} />
					: <input id={id} type={type} className={className} {...props} />
			}
		</div>
	)
}
