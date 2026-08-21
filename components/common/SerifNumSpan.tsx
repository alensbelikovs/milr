

export default function SerifNumSpan(
	{ children, sizeClass }: 
	{ children: React.ReactNode, sizeClass: string }
) {
	return (
		<span className={`font-serif ${sizeClass}`}>( {children} )</span>
	)
}