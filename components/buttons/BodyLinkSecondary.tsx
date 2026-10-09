import Link from "@/components/navigation/LocaleLink"

export default function BodyLinkSecondary({ children, href }: { children: React.ReactNode, href: string }) {
	return (
		<Link
			className="
				inline-block text-size-18
				underline underline-offset-4 hover:no-underline
				cursor-pointer
			"
			href={href}>
			{children}
		</Link>
	)
}
