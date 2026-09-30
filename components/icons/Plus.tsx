export default function Plus(
	{ dimensions=24, fill, className = "" }:
	{ dimensions: number; fill: string; className?: string }
) {
	return (
		<svg
			width={dimensions}
			height={dimensions}
			viewBox="0 0 12 12"
			className={className}
			fill={fill}
			xmlns="http://www.w3.org/2000/svg">
				<line x1="6" y1="11" x2="6" y2="1" stroke="currentColor" strokeWidth="1.5"/>
				<line x1="11" y1="5.75" x2="1" y2="5.75" stroke="currentColor" strokeWidth="1.5"/>
		</svg>
	)
}
