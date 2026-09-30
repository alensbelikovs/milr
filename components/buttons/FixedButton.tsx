// A text control pinned to the screen, placed and padded like the navbar's own: the same inset from
// the edge, the same h-size-64 band across the top. mix-blend-difference for the same reason as
// theirs — it sits over whatever the page has scrolled under it, and has to stay legible on all of
// it without being told what that is.
//
// lg:hidden by default, since what it opens so far only exists below lg. className goes last, so a
// caller can move it or show it elsewhere.
//
// z-9: one under the sidebar (z-10), so an open sidebar covers it, and under the navbar (z-15).
export default function FixedButton(
	{
		children, onClick, className = "",
		"aria-expanded": ariaExpanded, "aria-controls": ariaControls,
	}: {
		children: React.ReactNode
		onClick?: () => void
		className?: string
		"aria-expanded"?: boolean
		"aria-controls"?: string
	}
) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-expanded={ariaExpanded}
			aria-controls={ariaControls}
			className={`fixed top-0 left-size-24 h-size-64 z-9 lg:hidden
				flex items-center cursor-pointer
				mix-blend-difference text-white text-size-16 ${className}`}>
			{children}
		</button>
	)
}
