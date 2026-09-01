"use client"
import { useState } from "react"

import LinkPrimary from "@/components/common/LinkPrimary"
import Link from "next/link"
import Logo from "@/components/common/Logo"

export default function Navbar() {
	// Whether the menu is showing. Nothing reads it yet but the button's own label — the panel it
	// will open is not built, so this is the state waiting for it rather than state driving it.
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<header className="fixed top-0 left-0 z-10 w-full text-background mix-blend-difference pointer-events-none">
			<nav className="mt-regular px-[24px] lg:px-[36px] gap-regular grid grid-cols-12">
				{/* <Link href="/">
					<Logo dimensions="32"/>
				</Link>
				<div className="gap-regular col-start-7 col-span-3 hidden md:flex">
					<LinkPrimary href="/projects" target="_self">Projects</LinkPrimary>
					<LinkPrimary href="/diary" target="_self">Diary</LinkPrimary>
					<LinkPrimary href="/about" target="_self">About</LinkPrimary>
				</div>
				<div className="justify-end col-start-10 col-span-3 gap-regular hidden md:flex">
					<div className="flex items-start gap-micro">
						<LinkPrimary href="/">EN</LinkPrimary>
						/
						<LinkPrimary href="/">LV</LinkPrimary>
					</div>
					<LinkPrimary href="mailto:contact@milrstudio.com">Contact</LinkPrimary>
				</div>
				<div></div> */}
				<div className="col-span-6">
					<LinkPrimary href="/" className="pointer-events-auto">
						<Logo dimensions="32"/>
					</LinkPrimary>
				</div>
				<div className="col-span-5 col-start-8 flex justify-end">
					<div className="gap-regular md:flex hidden items-start justify-between w-full">
						<div className="flex gap-regular">
							<LinkPrimary href="/projects" className="pointer-events-auto">Projects</LinkPrimary>
							<LinkPrimary href="/diary" className="pointer-events-auto">Diary</LinkPrimary>
							<LinkPrimary href="/about" className="pointer-events-auto">About</LinkPrimary>
						</div>
						<div className="flex">
							<LinkPrimary href="/contact" className="pointer-events-auto">Contact</LinkPrimary>
						</div>
					</div>
					<div className="flex md:hidden">
						<button
							type="button"
							onClick={() => setMenuOpen(open => !open)}
							aria-expanded={menuOpen}
							className="link-primary pointer-events-auto">
							{menuOpen ? "Close" : "Menu"}
						</button>
					</div>
				</div>
			</nav>
		</header>
	)
}
