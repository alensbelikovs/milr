export default function Cross({ dimensions, fill }: { dimensions: number, fill: string }) {
	return (
		<svg
			aria-hidden
			width={dimensions}
			height={dimensions}
			viewBox="0 0 12 12"
			fill={fill}
			stroke="currentColor"
			strokeWidth="1.5"
			xmlns="http://www.w3.org/2000/svg">
			<line x1="1.53033" y1="1.46967" x2="10.5303" y2="10.4697" />
			<line x1="1.46967" y1="10.4697" x2="10.4697" y2="1.46967" />
		</svg>
	)
}
