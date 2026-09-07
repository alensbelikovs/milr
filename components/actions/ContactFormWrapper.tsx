"use client"

import { useEffect, useRef, useState } from "react"
import ContactForm from "@/components/actions/ContactForm"
import FormError from "@/components/actions/FormError"
import FormSuccess from "@/components/actions/FormSuccess"
import type { ContactStatusType } from "@/types/ContactTypes"

// The client boundary for the contact section. It lives here rather than in Contact so that
// Contact stays a server component — SectionNavWrapper reads navLabel off the section's element
// type, and a "use client" section would arrive as a module reference and drop out of the nav.
export default function ContactFormWrapper({ home }: { home?: boolean }) {
	const [status, setStatus] = useState<ContactStatusType | "idle">("idle")
	const resultRef = useRef<HTMLDivElement>(null)

	// The form the reader was standing in has just been replaced, taking the focused button with
	// it. Without this, focus falls back to <body> and a keyboard or screen-reader user is left at
	// the top of the document with no idea whether the message went anywhere.
	useEffect(() => {
		if (status === "idle") return
		resultRef.current?.focus()
	}, [status])

	if (status === "idle") return <ContactForm onResult={setStatus} />

	return (
		<div
			className="col-span-full"
			ref={resultRef}
			tabIndex={-1}
			role={status === "success" ? "status" : "alert"}>
			{status === "success" ? <FormSuccess home={home} /> : <FormError />}
		</div>
	)
}
