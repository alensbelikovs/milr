import { useEffect, useId, useRef } from "react"
import type { VideoBlogType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"

export default function VideoBlogGridShowOverlay(
	{ videoBlog, onClose }:
	{ videoBlog: VideoBlogType, onClose: () => void }
) {
	const { title, description, mediaUrl, _createdAt } = videoBlog

	// Ties the dialog to its heading for a screen reader, which is what announces the blog's title on
	// open instead of leaving the dialog unnamed.
	const headingId = useId()

	const closeRef = useRef<HTMLButtonElement>(null)

	// Focus lands on Close, so the dialog is reachable from the keyboard the moment it opens rather
	// than leaving focus on a card behind the overlay. The grid puts focus back on that card on close.
	useEffect(() => {
		closeRef.current?.focus()
	}, [])

	// Escape closes. Bound to the document rather than the overlay so it works wherever focus has
	// wandered inside the dialog, and re-bound whenever onClose changes identity.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose()
		}
		document.addEventListener("keydown", onKeyDown)
		return () => document.removeEventListener("keydown", onKeyDown)
	}, [onClose])

	return (
		<div
		onClick={event => { if (event.target === event.currentTarget) onClose() }}
		className="
			fixed left-0 top-0 h-screen w-full
			grid grid-cols-15 gap-regular
			grid-rows-12
			bg-black/50
		"
		>
			{/* The backdrop closes on a click that lands on the backdrop itself — event.target is what
			    was actually pressed, so anything inside the panel fails that test and the dialog stays
			    open. Cheaper than stopPropagation on the panel, which would also swallow bubbling that
			    has nothing to do with dismissal. */}
			<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={headingId}
			className="
				bg-background p-regular flex
				col-start-3 col-span-11
				gap-regular
				row-span-10 row-start-2
			"
			>
				<iframe
					src={mediaUrl}
					title={title}
					allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
					allowFullScreen
					className="bg-black/10 h-full aspect-10/16 border-0" />
				<div
				className="
					flex flex-col
					justify-center px-normal-2 w-full gap-small
				"
				>
					<p className="text-small">{formatDate(_createdAt)}</p>
					<h1 id={headingId} className="text-heading-3">{title}</h1>
					<p className="text-body-1">{description}</p>
					<button
						ref={closeRef}
						type="button"
						onClick={onClose}
						className="self-start mt-normal-2 text-body-1 underline underline-offset-4 opacity-60 hover:opacity-100 focus-visible:opacity-100 cursor-pointer">
						Close
					</button>
				</div>
			</div>
		</div>
	)
}
