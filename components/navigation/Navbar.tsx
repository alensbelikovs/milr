import Link from "@/components/navigation/LocaleLink"
import Logo from "@/components/icons/Logo"
import NavMenuButton from "@/components/navigation/NavMenuButton"
import { getDictionary } from "@/lib/dictionaries"

// Logo and menu button, fixed over every page; mix-blend-difference keeps them legible on anything
export default async function Navbar() {
	const dict = await getDictionary()

	return (
		<header className="fixed left-0 top-0 w-full mix-blend-difference z-15 pointer-events-none">
			<Link
				href="/"
				aria-label={dict.common.home}
				className="
					absolute top-0 left-size-24 h-size-64 aspect-square
					hidden lg:flex items-center pointer-events-auto
				">
				<Logo dimensions={32} fill="var(--background)" />
			</Link>
			<NavMenuButton />
		</header>
	)
}
