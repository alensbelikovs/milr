"use client"
import { useState } from "react"
import Script from "next/script"
import { sendGAEvent } from "@next/third-parties/google"
import BodyButton from "@/components/buttons/BodyButton"
import InputSelect from "@/components/inputs/InputSelect"
import InputString from "@/components/inputs/InputString"
import { useSite } from "@/components/layout/SiteProvider"
import {
	type ContactPayloadType,
	type ContactRequestType,
	type ContactStatusType,
} from "@/types/ContactTypes"

const EMPTY: ContactPayloadType = { name: "", email: "", subject: "", message: "" }

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

// Temporary: keeps the loading state visible in development
const LOADING_DELAY = 2000

export default function ContactForm({ onResult }: { onResult: (status: ContactStatusType) => void }) {
	const { form: copy } = useSite().dict.contact
	const [form, setForm] = useState<ContactPayloadType>(EMPTY)
	const [loading, setLoading] = useState(false)

	// Every control carries its payload key as its name
	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value } = event.target
		setForm(current => ({ ...current, [name]: value }))
	}

	// loading is never reset: the wrapper replaces this form with the result
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (loading) return
		setLoading(true)

		try {
			await new Promise(resolve => setTimeout(resolve, LOADING_DELAY))
			// Requested on submit, since tokens expire after two minutes
			const token = await new Promise<string>((resolve, reject) => grecaptcha.ready(() =>
				grecaptcha.execute(SITE_KEY, { action: "contact" }).then(resolve, reject)))
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...form, token } satisfies ContactRequestType),
			})
			const { status } = await response.json()
			// The conversion, marked as a key event in GA
			if (status === "success") sendGAEvent("event", "generate_lead", { form: "contact" })
			onResult(status === "success" ? "success" : "error")
		} catch {
			onResult("error")
		}
	}

	return (
		<div className="col-span-full grid grid-cols-12 gap-size-24">
			<Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`} />
			{/* Lines up with the intro paragraph in the hero above */}
			<form
				aria-label={copy.label}
				onSubmit={handleSubmit}
				className="
					col-start-1 col-span-full
					md:col-start-2 md:col-span-10
					lg:col-start-7 lg:col-span-5
					grid grid-cols-6 gap-size-24
				">
				<InputString
					id="contact-name"
					name="name"
					label={copy.name}
					placeholder={copy.namePlaceholder}
					autoComplete="name"
					required
					value={form.name}
					onChange={handleChange} />
				<InputString
					id="contact-email"
					name="email"
					label={copy.email}
					placeholder={copy.emailPlaceholder}
					type="email"
					autoComplete="email"
					required
					value={form.email}
					onChange={handleChange} />
				<InputString
					id="contact-message"
					name="message"
					label={copy.message}
					placeholder={copy.messagePlaceholder}
					autoComplete="off"
					required
					textarea
					value={form.message}
					onChange={handleChange}
					// Cmd/Ctrl+Enter submits, since Enter in a textarea is a newline
					onKeyDown={event => {
						if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return
						event.preventDefault()
						event.currentTarget.form?.requestSubmit()
					}} />
				<InputSelect
					id="contact-subject"
					name="subject"
					label={copy.subject}
					placeholder={copy.subjectPlaceholder}
					options={copy.subjects}
					required
					value={form.subject}
					onChange={handleChange} />
				<div className="col-span-full lg:col-span-3 mt-size-16 self-start">
					<BodyButton type="submit" disabled={loading} aria-busy={loading}>
						{copy.submit}
					</BodyButton>
				</div>
				<div className="
					col-start-2 col-span-4
					md:col-start-3 md:col-span-2
					lg:col-start-5 lg:col-span-2
					text-center lg:text-left mt-size-16
				">
					<p className="text-foreground/50 text-size-14">
						{copy.recaptcha.before}{" "}
						<a
							className="underline hover:no-underline"
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noreferrer">
							{copy.recaptcha.privacy}
						</a>
						{` ${copy.recaptcha.and} `}
						<a
							className="underline hover:no-underline"
							href="https://policies.google.com/terms"
							target="_blank"
							rel="noreferrer">
							{copy.recaptcha.terms}
						</a>
						{copy.recaptcha.after}
					</p>
				</div>
			</form>
		</div>
	)
}
