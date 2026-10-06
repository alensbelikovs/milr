"use client"
import { useEffect, useRef } from "react"
import FormError from "@/components/contact/FormError"
import FormSuccess from "@/components/contact/FormSuccess"
import { type ContactStatusType } from "@/types/ContactTypes"

export default function ContactResult({ status }: { status: ContactStatusType }) {
	const scopeRef = useRef<HTMLDivElement>(null)

	// The focused button is gone, so focus moves here; preventScroll keeps the page at the top
	useEffect(() => { scopeRef.current?.focus({ preventScroll: true }) }, [])

	return (
		<div ref={scopeRef} tabIndex={-1} role={status === "success" ? "status" : "alert"}>
			{status === "success" ? <FormSuccess /> : <FormError />}
		</div>
	)
}
