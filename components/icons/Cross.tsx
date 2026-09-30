export default function Cross(
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
				<line x1="1.53033" y1="1.46967" x2="10.5303" y2="10.4697" stroke="currentColor" strokeWidth="1.5"/>
				<line x1="1.46967" y1="10.4697" x2="10.4697" y2="1.46967" stroke="currentColor" strokeWidth="1.5"/>
		</svg>
	)
}
