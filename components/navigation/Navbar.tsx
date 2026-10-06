import Link from "next/link"
import Logo from "@/components/icons/Logo"
import NavMenuButton from "@/components/navigation/NavMenuButton"

// Logo and menu button, fixed over every page; mix-blend-difference keeps them legible on anything
export default function Navbar() {
	return (
		<header className="fixed left-0 top-0 w-full mix-blend-difference z-15 pointer-events-none">
			<Link
				href="/"
				aria-label="Home"
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
