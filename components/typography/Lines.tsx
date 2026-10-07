import { Fragment } from "react"

// Dictionary lines joined with <br />, for headings that break at a set point
export default function Lines({ lines }: { lines: string[] }) {
	return lines.map((line, index) => (
		<Fragment key={index}>{index > 0 && <br />}{line}</Fragment>
	))
}
