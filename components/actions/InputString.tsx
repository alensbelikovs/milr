"use client"

// A labelled text field. `textarea` swaps the <input> for a real <textarea> — the two share every
// prop, so the caller only picks the shape.
export default function InputString(
	{ id, name, placeholder, value, onChange, onKeyDown, label, textarea,
		type = "text", required, autoComplete }:
		{
			id: string;
			name: string;
			placeholder: string;
			value: string;
			onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
			onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
			label: string;
			textarea?: boolean;
			type?: React.HTMLInputTypeAttribute;
			required?: boolean;
			autoComplete?: string;
		}) {
	// htmlFor/id is what makes the visible label the control's accessible name, so no aria-label
	// is needed here — one would only override the label a sighted user is reading.
	const className = `
		group border-b border-b-foreground/10 text-size-24
		${textarea ? "pt-size-16 pb-size-48 resize-y scrollbar-background" : "py-size-16"}
	`

	return (
		<div className="flex flex-col col-span-full">
			<label className="text-size-16" htmlFor={id}>{label}</label>
			{textarea
				? (
					<textarea
						className={className}
						id={id}
						name={name}
						rows={4}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onKeyDown={onKeyDown}
						required={required}
						autoComplete={autoComplete} />
				)
				: (
					<input
						className={className}
						id={id}
						name={name}
						type={type}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onKeyDown={onKeyDown}
						required={required}
						autoComplete={autoComplete} />
				)}
		</div>
	)
}
