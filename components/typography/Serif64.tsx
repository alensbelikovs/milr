export default function Serif48(
	{ children }:
		{ children: React.ReactNode })
{
	return (
		<div className="col-start-3 col-span-8">
			<p className="text-size-64 font-serif text-center">{children}</p>
		</div>
	)
}
