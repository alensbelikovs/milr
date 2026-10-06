// EN / LV switch in the menu; markup only for now
export default function LanguageSelect() {
	return (
		<div className="text-size-16 flex items-center gap-size-12">
			<button type="button" className="text-foreground cursor-pointer hover:underline">EN</button>
			<span className="text-foreground">/</span>
			<button type="button" className="text-foreground/50 cursor-pointer hover:underline">LV</button>
		</div>
	)
}
