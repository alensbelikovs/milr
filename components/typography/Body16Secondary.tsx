export default function Body16Secondary(
	{ children, className }:
		{ children: React.ReactNode, className?: string }) {
	return (
		<div className={`col-start-7 col-span-2 ${className}`}>
			<p className="text-size-16">{children}</p>
		</div>
	)
}
