import DetailList from "@/components/general/DetailList"
import NavLink from "@/components/actions/NavLink"

export default function DetailListSocials(
	{ className }:
		{ className?: string }) {
	return (
		<DetailList label="Socials" className={className}>
			<li className="my-2"><NavLink active target="_blank" href="https://www.instagram.com/">Instagram</NavLink></li>
			<li className="my-2"><NavLink active target="_blank" href="https://www.tiktok.com/">TikTok</NavLink></li>
		</DetailList>
	)
}
