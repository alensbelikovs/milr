import type { FormEvent } from "react"

// The layout every MobileSheet body shares: its content on the sidebar menu's grid, scrolling, and a
// footer pinned to the bottom of the sheet over a fade.
//
// The root is the caller's landmark — a nav for links, a form for choices that are submitted — so
// the sheet itself stays neutral and each body says what it is.
//
// The footer is absolute against the sheet's panel, which does not scroll, so it stays where it is
// while the content moves beneath it. pb-size-288 on the content is room for the last row to scroll
// clear of it.
export default function MobileSheetBody(
	{ as: Root = "div", children, footer, onSubmit, "aria-label": ariaLabel }: {
		as?: "div" | "nav" | "form"
		children: React.ReactNode
		footer?: React.ReactNode
		onSubmit?: (event: FormEvent<HTMLFormElement>) => void
		"aria-label"?: string
	}
) {
	const content = (
		<>
			<div className="h-full overflow-y-auto overscroll-contain">
				<div className="grid grid-cols-6 px-size-24 gap-x-size-24 gap-y-size-96 pt-size-96 pb-size-288">
					{children}
				</div>
			</div>
			{footer && (
				<div className="absolute inset-x-0 bottom-0 flex px-size-24 py-size-96 z-5
					bg-linear-to-t from-background to-background/0">
					{footer}
				</div>
			)}
		</>
	)

	// The form on its own branch: onSubmit is typed for a form, and handed to a Root that could as
	// well be a div or a nav, it would have to be a handler for all three at once.
	if (Root === "form") {
		return <form aria-label={ariaLabel} onSubmit={onSubmit} className="h-full">{content}</form>
	}

	return <Root aria-label={ariaLabel} className="h-full">{content}</Root>
}
