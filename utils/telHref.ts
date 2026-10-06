// tel: needs digits only, keeping a leading + for international numbers
export default function telHref(phone: string) {
	return `tel:${phone.trim().startsWith("+") ? "+" : ""}${phone.replace(/\D/g, "")}`
}
