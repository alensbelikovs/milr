"use client"
import { useEffect, useRef } from "react"
import FormSuccess from "@/components/contact/FormSuccess"
import FormError from "@/components/contact/FormError"
import type { ContactStatusType } from "@/types/ContactTypes"

// What the contact section becomes once the message has been answered for. Which of the two it is,
// what that means to a screen reader, and where focus lands — the entrance belongs to whichever
// body is chosen, and each of those owns its own.
//
// Its own component rather than a branch inside ContactFormWrapper, because the focus below wants
// to happen exactly once, when a result appears. Mounting IS that moment, so the effect needs no
// dependencies to get it right.
export default function ContactResult(
	{ status }: { status: ContactStatusType }) {
	const scopeRef = useRef<HTMLDivElement>(null)

	const success = status === "success"

	// The form the reader was standing in has just been replaced, taking the focused button with
	// it. Without this, focus falls back to <body> and a keyboard or screen-reader user is left at
	// the top of the document with no idea whether the message went anywhere.
	//
	// preventScroll, because focusing an element otherwise scrolls it into view — and the wrapper
	// has just put the page back at the top on purpose, so this would drag it straight back down to
	// wherever the section sits. It would also be a native scroll, moving window.scrollY out from
	// under the Lenis loop that was asked to do the moving.
	useEffect(() => { scopeRef.current?.focus({ preventScroll: true }) }, [])

	return (
		<div
			ref={scopeRef}
			tabIndex={-1}
			role={success ? "status" : "alert"}>
			{success ? <FormSuccess /> : <FormError />}
		</div>
	)
}
