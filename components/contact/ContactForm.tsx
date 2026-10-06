"use client"
import { useState } from "react"
import BodyButton from "@/components/buttons/BodyButton"
import InputSelect from "@/components/inputs/InputSelect"
import InputString from "@/components/inputs/InputString"
import { useGeneralInformation } from "@/store/GeneralInformationStore"
import telHref from "@/utils/telHref"
import { type ContactPayloadType, type ContactStatusType } from "@/types/ContactTypes"

const SUBJECTS = {
	project: "Subject one",
	collaboration: "Subject two",
	other: "Subject three",
}

const EMPTY: ContactPayloadType = { name: "", email: "", subject: "", message: "" }

// Temporary: keeps the loading state visible in development
const LOADING_DELAY = 2000

export default function ContactForm({ onResult }: { onResult: (status: ContactStatusType) => void }) {
	const information = useGeneralInformation(state => state.information)
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
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			})
			const { status } = await response.json()
			onResult(status === "success" ? "success" : "error")
		} catch {
			onResult("error")
		}
	}

	return (
		<div className="col-span-full grid grid-cols-12 gap-size-24">
			<aside className="
				col-start-2 col-span-10
				sm:col-start-5 sm:col-span-4
				lg:col-start-2 lg:col-span-2
				text-center lg:text-left mb-size-96
			">
				<p className="text-size-24">
					Send a quick note to start the chat
					{
						information &&
						<>
							, or reach me directly by{" "}
							<a className="underline hover:no-underline" href={`mailto:${information.email}`}>
								E-mail
							</a>
							{" or "}
							<a className="underline hover:no-underline" href={telHref(information.phone)}>
								Phone
							</a>
						</>
					}
					.
				</p>
			</aside>
			<form
				aria-label="Contact form"
				onSubmit={handleSubmit}
				className="
					col-start-1 col-span-full
					lg:col-start-6 lg:col-span-6
					grid grid-cols-6 gap-size-24
				">
				<InputString
					id="contact-name"
					name="name"
					label="Name *"
					placeholder="Your name"
					autoComplete="name"
					required
					value={form.name}
					onChange={handleChange} />
				<InputString
					id="contact-email"
					name="email"
					label="Email *"
					placeholder="Your email"
					type="email"
					autoComplete="email"
					required
					value={form.email}
					onChange={handleChange} />
				<InputString
					id="contact-message"
					name="message"
					label="Message *"
					placeholder="Your message"
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
					label="Subject *"
					placeholder="Select a subject"
					options={SUBJECTS}
					required
					value={form.subject}
					onChange={handleChange} />
				<div className="col-span-full lg:col-span-3 mt-size-16 self-start">
					<BodyButton type="submit" disabled={loading} aria-busy={loading}>
						Send Message
					</BodyButton>
				</div>
				<div className="
					col-start-2 col-span-4
					md:col-start-3 md:col-span-2
					lg:col-start-5 lg:col-span-2
					text-center lg:text-left mt-size-16
				">
					<p className="text-foreground/50 text-size-14">
						This site uses reCAPTCHA to prevent spam, so Google&apos;s{" "}
						<a
							className="underline hover:no-underline"
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noreferrer">
							Privacy Policy
						</a>
						{" and "}
						<a
							className="underline hover:no-underline"
							href="https://policies.google.com/terms"
							target="_blank"
							rel="noreferrer">
							Terms of Service
						</a>
						{" apply."}
					</p>
				</div>
			</form>
		</div>
	)
}
