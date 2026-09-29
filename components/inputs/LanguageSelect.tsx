// The language pair in the menu's top right: EN / LV, the one in use at full strength and the other
// muted. The divider stays at full strength either way — it belongs to neither language, so it does
// not dim with the one that is off.
//
// Markup and styling only for now. Nothing here switches anything, and which one looks active is
// written into the classes below rather than read from the app.
//
// Buttons rather than links, because a language is a setting rather than a place: switching it
// changes what the current page is written in instead of going to another page. If the two ever get
// addresses of their own, these become anchors.
//
// The hover underline sits on each button rather than on the row, so the pointer marks the one
// language it is over and leaves the divider and the other language alone.
export default function LanguageSelect({ className = "" }: { className?: string }) {
	return (
		<div className={`text-size-16 flex items-center gap-size-12 ${className}`}>
			<button type="button" className="text-foreground cursor-pointer hover:underline">EN</button>
			<span className="text-foreground">/</span>
			<button type="button" className="text-foreground/50 cursor-pointer hover:underline">LV</button>
		</div>
	)
}
