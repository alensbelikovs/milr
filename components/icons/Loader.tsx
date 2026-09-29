// The spinner that stands in for an arrow while a control is busy — see BodyButton.
//
// animate-spin-fast is this project's, beside the arrow animations in globals.css. Tailwind ships
// the same animation as animate-spin and it is only the duration that is wrong: a full second a
// revolution is slow enough to read as stalled at the size this is drawn, which is 12px inside a
// button. The duration-* utilities do not reach animation-duration — they set transition-duration —
// so the number lives in the theme with every other piece of timing on the site.
//
// The class goes on the svg root rather than on the path inside it. The root is a replaced element
// in the HTML flow, so it takes the ordinary 50% 50% transform-origin and turns about its own
// centre; an element INSIDE the svg would default to an origin of 0 0 and swing around the corner
// of the viewBox instead.
//
// The ring is drawn to the edges of a square viewBox, so it is its own bounding box turned about
// its centre — which is what lets it spin inside BodyButton's overflow-hidden mask without the
// corners being shaved off.
export default function Loader(
	{ dimensions=24, fill, className = "" }:
	{ dimensions: number; fill: string; className?: string }
) {
	return (
		<svg
			width={dimensions}
			height={dimensions}
			viewBox="0 0 12 12"
			className={`animate-spin-fast ${className}`}
			fill={fill}
			xmlns="http://www.w3.org/2000/svg">
			<path d="M6 0C4.81331 -1.41511e-08 3.65327
				0.351894 2.66658 1.01118C1.67988 1.67047 0.910849
				2.60754 0.456723 3.7039C0.00259702 4.80026 -0.116223
				6.00666 0.115288 7.17054C0.3468 8.33443 0.918244
				9.40353 1.75736 10.2426C2.59647 11.0818 3.66557
				11.6532 4.82946 11.8847C5.99334 12.1162 7.19974
				11.9974 8.2961 11.5433C9.39246 11.0892 10.3295
				10.3201 10.9888 9.33342C11.6481 8.34673 12
				7.18669 12 6H10.5849C10.5849 6.90681 10.316
				7.79325 9.8122 8.54723C9.30841 9.30121 8.59234
				9.88887 7.75456 10.2359C6.91678 10.5829 5.99491
				10.6737 5.10553 10.4968C4.21615 10.3199 3.3992
				9.88322 2.75799 9.24201C2.11678 8.6008 1.68011
				7.78385 1.5032 6.89447C1.32629 6.00509 1.41709
				5.08322 1.76411 4.24544C2.11113 3.40766 2.69879
				2.69159 3.45277 2.1878C4.20675 1.68401 5.09319
				1.41511 6 1.41511L6 0Z" />
		</svg>
	)
}
