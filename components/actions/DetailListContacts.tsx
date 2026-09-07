import DetailList from "@/components/general/DetailList"
import NavLink from "@/components/actions/NavLink"

export default function DetalListContacts(
	{ className }:
		{ className?: string }) {
	return (
		<DetailList label="Contacts" className={className}>
			<li className="my-2"><NavLink active href="mailto:">contact@milrstudio.com</NavLink></li>
			<li className="my-2"><NavLink active href="tel:">+371 28 755 431</NavLink></li>
		</DetailList>
	)
}
