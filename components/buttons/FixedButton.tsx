// A text control pinned to the top-left corner on mobile, legible over anything via mix-blend-difference
export default function FixedButton(
	{ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			className="
				fixed top-0 left-size-24 h-size-64 z-9 lg:hidden
				flex items-center cursor-pointer
				mix-blend-difference text-white text-size-16
			"
			{...props}>
			{children}
		</button>
	)
}
