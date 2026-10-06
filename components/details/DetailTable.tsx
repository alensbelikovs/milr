// A table of facts, one DetailTableRow per fact
export default function DetailTable(
	{ children, className = "" }: { children: React.ReactNode, className?: string }) {
	return (
		<div className={`
			col-start-1 col-span-full
			md:col-start-2 md:col-span-10
			lg:col-start-6 lg:col-span-6
			${className}
		`}>
			{children}
		</div>
	)
}
