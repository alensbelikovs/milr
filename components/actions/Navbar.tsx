"use client"
import { useSidebarContentStore } from "@/store/SidebarContentStore"

export default function Navbar() {
	const toggleNav = useSidebarContentStore(state => state.toggleNav)

	return (
		<header
			className="
				p-size-24
				fixed left-0 top-0 w-full
				z-15 pointer-events-none">
			<nav className="flex justify-between items-center text-size-16">
				<div>logo</div>
				<button
					onClick={toggleNav}
					className="cursor-pointer pointer-events-auto">Menu</button>
			</nav>
		</header>
	)
}
