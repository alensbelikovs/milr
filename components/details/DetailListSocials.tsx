"use client"
import DetailList from "@/components/details/DetailList"
import NavLink from "@/components/navigation/NavLink"
import { useGeneralInformation } from "@/store/GeneralInformationStore"

// Wherever the studio is, in the order the editor arranged them. Keyed on _key rather than the index
// or the title: it is the array item's own identity, so reordering the list in the Studio moves the
// rows rather than rewriting them.
export default function DetailListSocials(
	{ className = "" }:
		{ className?: string }) {
	const information = useGeneralInformation(state => state.information)

	// The singleton requires at least one social, so an empty list here means an unsaved singleton
	// rather than a studio that is on nothing — either way there is no list to draw.
	if (!information || information.socials.length === 0) return null

	return (
		<DetailList label="Socials" className={className}>
			{information.socials.map(social => (
				<li className="my-2" key={social._key}>
					<NavLink active target="_blank" href={social.url}>{social.title}</NavLink>
				</li>
			))}
		</DetailList>
	)
}
