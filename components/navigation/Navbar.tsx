import Link from "next/link"
import Logo from "@/components/icons/Logo"
import NavMenuButton from "@/components/navigation/NavMenuButton"

// The two controls that belong to the site rather than to any page: the mark in one corner and the
// menu toggle in the other. Fixed, so they stay put while the page moves, and in the layout rather
// than in a page so they survive a navigation instead of being torn down and rebuilt.
//
// mix-blend-difference is what lets them sit over anything — a black hero, a white section, a
// photograph — without either being told what is underneath them. It is the reason these two are
// still here while the route links have moved out: a blend mode is decided by whatever it happens
// to be drawn over, which is right for a mark that is only ever a shape, and wrong for words that
// should be one deliberate colour. See MainNav.
//
// No <nav> in here. There was one, wrapping these two, and it was doing nothing: neither child is
// laid out by it — both are positioned against this header, which is the fixed one — and a
// navigation landmark holding a logo and a button is a landmark a screen-reader user cycles into
// only to find nothing to navigate with. The landmark lives with the links now.
//
// pointer-events-none on the header, auto on each control: the header is a full-width band across
// the top of every page, and without this it would swallow every click along that band.
export default function Navbar() {
	return (
		<header className="fixed left-0 top-0 w-full mix-blend-difference z-15 pointer-events-none">
			{/* The link has to carry its own name: what is inside it is a shape with no text, so
			    without this it reaches a screen reader as a link with nothing to read out.
			    Desktop only: below lg this corner belongs to SectionNavMobile's Jump To. */}
			<Link
				href="/"
				aria-label="Home"
				className="pointer-events-auto absolute left-size-24
				h-size-64 top-0 aspect-square hidden lg:flex items-center">
				<Logo dimensions={32} fill="var(--background)" />
			</Link>
			<NavMenuButton />
		</header>
	)
}
