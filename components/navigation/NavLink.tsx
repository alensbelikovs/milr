import Link from "@/components/navigation/LocaleLink"

// Inactive links are dimmed; only SectionNav ever marks one inactive
export default function NavLink(
	{ children, href, active = true, target, onClick }: {
		children: React.ReactNode,
		href: string,
		active?: boolean,
		target?: string,
		onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
	}) {
	return (
		<Link
			href={href}
			target={target}
			onClick={onClick}
			className={`
				text-size-16 transition-colors hover:underline
				${active ? "text-current" : "text-current/50"}
			`}>
			{children}
		</Link>
	)
}
