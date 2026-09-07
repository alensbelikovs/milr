export default function Body18(
	{ children }:
		{ children: React.ReactNode })
{
	// Attach ScrollTrigger to div for animation
	return (
		<div>
			<p className="font-serif text-size-18">{children}</p>
		</div>
	)
}
