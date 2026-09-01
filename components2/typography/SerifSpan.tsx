
// Written out in full rather than built as `text-size-${size}`, because Tailwind finds the classes
// it generates by reading the source as plain text: an interpolated name is never there to find, so
// the span would come out at whatever size it inherited. Keyed by the same numbers the theme names,
// and `size` is typed to this object, so an unknown one is a compile error rather than a silent miss.
const SIZE_CLASS_NAMES = {
	"12": "text-size-12",
	"14": "text-size-14",
	"16": "text-size-16",
	"18": "text-size-18",
	"21": "text-size-21",
	"24": "text-size-24",
} as const

// leading-none because this rides inside someone else's line: the size utilities carry a line height
// with them, and an inline span imposing its own would push the line it sits in taller. align-top
// then pins what is left to the top of that line box, so it reads as a superscript on the word it
// follows rather than sitting on the baseline beside it — and the two go together, since without
// leading-none the span's own half-leading would pad the digit back down from that edge.
const TYPE_CLASS_NAME = "font-serif leading-none align-top"

export default function SerifSpan(
	{ children, size = "18", forceSpacing }:
		{
			children: React.ReactNode
			size?: keyof typeof SIZE_CLASS_NAMES
			forceSpacing?: string
		})
{
	// No spacing of its own to replace — it sits against the text it counts — so forceSpacing adds
	// the margin that holds it off, rather than swapping one out.
	const className = `${TYPE_CLASS_NAME} ${SIZE_CLASS_NAMES[size]} ${forceSpacing ?? ""}`.trim()

	return (
		<span className={className}>
			( {children} )
		</span>
	)
}
