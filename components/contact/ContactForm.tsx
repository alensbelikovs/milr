"use client"

import { useState } from "react"
import InputString from "@/components/inputs/InputString"
import InputSelect from "@/components/inputs/InputSelect"
import BodyButton from "@/components/buttons/BodyButton"
import type { ContactPayloadType, ContactStatusType } from "@/types/ContactTypes"

const SUBJECTS = {
	project: "Subject one",
	collaboration: "Subject two",
	other: "Subject three",
}

const EMPTY: ContactPayloadType = { name: "", email: "", subject: "", message: "" }

// Scaffolding, not a feature: the route answers fast enough in development that the button's
// loading state is gone before anyone can look at it. Drop this and the await that uses it once the
// state has been checked.
const LOADING_DELAY = 2000

export default function ContactForm(
	{ onResult }: { onResult: (status: ContactStatusType) => void }) {
	const [form, setForm] = useState<ContactPayloadType>(EMPTY)
	const [loading, setLoading] = useState(false)

	// One handler for every control: each one carries the payload key as its `name`, so nothing
	// here has to know which field it is looking at.
	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { name, value } = event.target
		setForm(current => ({ ...current, [name]: value }))
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (loading) return

		setLoading(true)

		// loading is never put back. The answer goes up to the wrapper, which fades this block out
		// and replaces it — so there is nothing left to return to an idle state, and while the block
		// is fading, a button that has gone back to reading "Send Message" would be offering
		// something that is already on its way out.
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
			// An offline browser never reaches the route, so there is no status to read — the
			// reader gets the same "contact me directly" answer either way.
			onResult("error")
		}
	}

	// Enter inside a textarea inserts a newline, so without this the message field has no
	// keyboard-only way to submit short of tabbing back out to the button.
	function handleMessageKeyDown(
		event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return
		event.preventDefault()
		event.currentTarget.form?.requestSubmit()
	}

	return (
		<div className="col-span-full grid grid-cols-12 gap-size-24">
			<aside className="
				text-center lg:text-left
				col-start-2 col-span-10
				sm:col-span-4 sm:col-start-5
				lg:col-span-2 lg:col-start-2
				mb-size-96">
				<p className="text-size-24">
					{
						"Send a quick note to start the chat," +
						" or reach me directly by "
					}
					<a className="underline hover:no-underline" href="mailto:">E-mail</a>
					{" or "}
					<a className="underline hover:no-underline" href="tel:">Phone</a>
					{"."}
				</p>
			</aside>
			<form
				className="col-start-1 col-span-full lg:col-start-6 lg:col-span-6 grid grid-cols-6 gap-size-24"
				aria-label="Contact form"
				onSubmit={handleSubmit}>
				<InputString
					id="contact-name"
					name="name"
					label="Name *"
					placeholder="Your name"
					autoComplete="name"
					required
					textarea={false}
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
					textarea={false}
					value={form.email}
					onChange={handleChange} />
				<InputString
					id="contact-message"
					name="message"
					label="Message *"
					placeholder="Your message"
					autoComplete="off"
					required
					textarea={true}
					value={form.message}
					onChange={handleChange}
					onKeyDown={handleMessageKeyDown} />
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
					{/* One label, whatever the state: while it is busy the button shows its own
					    rotating one instead, and this is what a screen reader keeps hearing. */}
					<BodyButton type="submit" disabled={loading} aria-busy={loading}>
						Send Message
					</BodyButton>
				</div>
				<div className="col-span-4 col-start-2 text-center md:col-span-2 md:col-start-3 lg:text-left lg:col-span-2 lg:col-start-5 mt-size-16">
					<p className="text-foreground/50 text-size-14">
						{
							"This site uses reCAPTCHA to prevent spam,"
							+ " so Google's "
						}
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
