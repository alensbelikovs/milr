import Link from "next/link"

export default function BodyLink(
	{ children, target="_self", href="#" }:
		{ children: React.ReactNode; target?: string; href?: string; })
{
	return (
		<div className="col-start-7 col-span-3">
			<Link
				className="text-size-16 underline hover:no-underline underline-offset-4 cursor-pointer"
				href={href}
				target={target}>
				{ children }
			</Link>
		</div>
	)
}
