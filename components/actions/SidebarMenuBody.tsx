"use client"
import DetailList from "@/components/general/DetailList"
import Link from "next/link"
import { useNavList } from "@/hooks/useNavList"
import DetailListHours from "@/components/actions/DetailListHours"
import DetailListAddress from "@/components/actions/DetailListAddress"
import DetailListSocials from "@/components/actions/DetailListSocials"
import DetailListContacts from "@/components/actions/DetailListContacts"

export default function SidebarMenuBody() {
	return (
		<div className="grid grid-cols-6
			px-size-24 gap-x-size-24
			gap-y-size-96 pt-size-96">
			<Navigation />
			<DetailListContacts className="col-span-2 col-start-2"/>
			<DetailListHours className="col-span-2"/>
			<DetailListSocials className="col-span-2 col-start-2"/>
			<DetailListAddress className="col-span-2"/>
		</div>
	)
}

const Navigation = () => {
	const navList = useNavList()
	return (
		<div className="col-start-2 col-span-4">
			<DetailList label="See Next">
				{
					navList.map(route => (
						<li className="my-2" key={route.href}>
							<Link
								target="_self"
								className="text-size-36 hover:underline"
								href={route.href}>{route.label}</Link>
						</li>
					))
				}
			</DetailList>
		</div>
	)
}
