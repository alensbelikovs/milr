"use client"

import { useRef, useState } from "react"

const SUBJECTS = [
	"Residential interior",
	"Commercial interior",
	"Consultation",
	"Something else",
]

// Local part, @, domain, at least one dot, and a TLD of two letters or more.
//
// Nothing here restricts case, so John@email.com and john@email.com both pass — the two differ only
// in a part of the address no rule may fold. The TLD is any run of letters rather than a list, so
// .com, .net and .lv are alike to it and a new one needs no change here.
//
// The domain half repeats to allow subdomains and multi-part suffixes: mail.example.co.uk.
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

// Also the order errors are reported in, so the field focused after a failed submit is the first one
// the reader would come to rather than the first one the validator happened to find.
const FIELDS = ["name", "email", "subject", "message"] as const

type FieldName = (typeof FIELDS)[number]
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>

const EMPTY: Values = { name: "", email: "", subject: "", message: "" }

// border-b rather than a box, and the colour is the only thing that moves on focus — plus a real
// outline, because a stroke going from 20% to full is a contrast change and not everyone reads one.
const FIELD_CLASS_NAME = `
	w-full bg-transparent p-size-16 text-size-24
	border-b border-foreground/20
	placeholder:text-foreground/30
	focus:border-foreground
	focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground
`

const LABEL_CLASS_NAME = "text-size-16"

const ERROR_CLASS_NAME = "text-size-14 pt-size-12 text-foreground/50"

const validate = (values: Values): Errors => {
	const errors: Errors = {}

	if (!values.name.trim()) errors.name = "Please enter a name or organization."

	if (!values.email.trim()) errors.email = "Please enter an e-mail address."
	else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid e-mail address."

	if (!values.subject) errors.subject = "Please choose a subject."

	if (!values.message.trim()) errors.message = "Please describe your idea."

	return errors
}

export default function ContactForm() {
	const formRef = useRef<HTMLFormElement>(null)

	const [values, setValues] = useState<Values>(EMPTY)
	const [errors, setErrors] = useState<Errors>({})
	const [sent, setSent] = useState(false)

	// Nothing is marked wrong until a submit has been attempted. Validating as someone types tells
	// them their address is invalid while they are still on the second letter of it.
	const [submitted, setSubmitted] = useState(false)

	const update = (field: FieldName, value: string) => {
		const next = { ...values, [field]: value }
		setValues(next)
		setSent(false)

		// Only once they have seen the errors: from then on a field clears as it is fixed, rather than
		// staying marked wrong until the whole form is sent again.
		if (submitted) setErrors(validate(next))
	}

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const nextErrors = validate(values)
		setErrors(nextErrors)
		setSubmitted(true)

		const firstInvalid = FIELDS.find(field => nextErrors[field])

		if (firstInvalid) {
			// Moved rather than merely marked, so a keyboard reader is put at the first thing to fix
			// instead of being told something is wrong somewhere above.
			formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus()
			return
		}

		// No endpoint yet. The form is complete and correct at this point, and this is where the send
		// goes when there is somewhere to send it to.
		setValues(EMPTY)
		setSubmitted(false)
		setSent(true)
	}

	// Marked invalid only when there is a message to point at, so aria-invalid and the text below can
	// never disagree about whether a field is in trouble.
	const fieldProps = (field: FieldName) => ({
		id: `contact-${field}`,
		name: field,
		required: true,
		"aria-invalid": errors[field] ? true : undefined,
		"aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
		className: FIELD_CLASS_NAME,
	})

	const errorFor = (field: FieldName) => errors[field] && (
		<p id={`contact-${field}-error`} className={ERROR_CLASS_NAME}>
			{errors[field]}
		</p>
	)

	return (
		// noValidate so these messages are the ones shown. Left to the browser, the first invalid field
		// raises a bubble that styles nothing like the page and says something else entirely — and it
		// stops at the first one rather than marking them all. The fields keep `required` regardless,
		// because that is what tells assistive tech they are required.
		<form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-size-32">
			<div className="flex flex-col">
				<label htmlFor="contact-name" className={LABEL_CLASS_NAME}>
					Name or Organization *
				</label>
				<input
					{...fieldProps("name")}
					type="text"
					autoComplete="organization"
					placeholder="John"
					value={values.name}
					onChange={event => update("name", event.target.value)} />
				{errorFor("name")}
			</div>

			<div className="flex flex-col">
				<label htmlFor="contact-email" className={LABEL_CLASS_NAME}>
					E-mail *
				</label>
				{/* type="email" for the keyboard it brings up on a phone and the meaning it carries, not
				    for its validation — noValidate turns that off, and EMAIL_PATTERN is the rule here. */}
				<input
					{...fieldProps("email")}
					type="email"
					autoComplete="email"
					placeholder="johndoe@gmail.com"
					value={values.email}
					onChange={event => update("email", event.target.value)} />
				{errorFor("email")}
			</div>

			<div className="flex flex-col">
				<label htmlFor="contact-subject" className={LABEL_CLASS_NAME}>
					Subject *
				</label>
				{/* A plain select, so it opens and is typed into the way every other one on the machine
				    does. appearance-none drops the platform arrow; the span beside it is decorative and
				    hidden from assistive tech, and takes no pointer events so the whole field stays
				    clickable through it. */}
				<div className="relative">
					<select
						{...fieldProps("subject")}
						className={`${FIELD_CLASS_NAME} appearance-none cursor-pointer pr-size-64`}
						value={values.subject}
						onChange={event => update("subject", event.target.value)}
					>
						<option value="" disabled>Select a subject</option>
						{SUBJECTS.map(subject => (
							<option key={subject} value={subject}>{subject}</option>
						))}
					</select>
					<span
						aria-hidden
						className="
							pointer-events-none absolute right-size-16 top-1/2 -translate-y-1/2
							text-size-16"
					>
						Icon
					</span>
				</div>
				{errorFor("subject")}
			</div>

			<div className="flex flex-col">
				<label htmlFor="contact-message" className={LABEL_CLASS_NAME}>
					Message *
				</label>
				<textarea
					{...fieldProps("message")}
					rows={2}
					placeholder="Describe your idea"
					value={values.message}
					onChange={event => update("message", event.target.value)} />
				{errorFor("message")}
			</div>

			<div className="flex items-end justify-between gap-size-24 pt-size-16">
				<div className="flex flex-col gap-size-12">
					<button
						type="submit"
						className="
							w-fit cursor-pointer text-size-16 underline underline-offset-4
							focus-visible:outline-2 focus-visible:outline-offset-4
							focus-visible:outline-foreground"
					>
						Send Message
					</button>
					{/* Polite and always mounted: a region announced only once it appears is a region the
					    reader was not listening to yet. */}
					<p role="status" className="text-size-14 text-foreground/50">
						{sent && "Thank you — your message is on its way."}
					</p>
				</div>
				<p className="text-size-12 text-foreground/50 max-w-[15rem]">
					This site uses reCAPTCHA to prevent spam, so Google&apos;s{" "}
					<a
						href="https://policies.google.com/privacy"
						target="_blank"
						rel="noreferrer"
						className="underline underline-offset-2"
					>
						Privacy Policy
					</a>{" "}
					and{" "}
					<a
						href="https://policies.google.com/terms"
						target="_blank"
						rel="noreferrer"
						className="underline underline-offset-2"
					>
						Terms of Service
					</a>{" "}
					apply.
				</p>
			</div>
		</form>
	)
}
