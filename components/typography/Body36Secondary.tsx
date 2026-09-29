import TextLineSplit from "@/components/animation/TextLineSplit"

// instant passes straight through: it is the caller who knows whether this copy is worth waiting
// for a line at a time, or is already on screen when the page arrives and should simply be there.
export default function Body36Secondary(
	{ children, instant = false }:
		{ children: React.ReactNode; instant?: boolean }) {
	return (
		<TextLineSplit className="text-size-36" instant={instant}>{children}</TextLineSplit>
	)
}
