import Image from "@/components/media/Image"
import buildImageUrl, { HERO } from "@/utils/buildImageUrl"
import imageOrientation from "@/utils/imageOrientation"
import { variantAt } from "@/utils/variantAt"
import { type WorkGalleryImageType } from "@/types/ContentTypes"

// The placement rhythm the gallery plays over its pictures: a full-bleed opener, a pair stepped in
// from the left, a second opener, and a pair stepped the other way. Six steps, and variantAt wraps
// them, so a seventh picture starts the pattern over rather than falling out of the grid with no
// placement at all.
//
// Each pair overlaps itself by a column — 2..6 against 6..10 — and that overlap is what staggers it.
// An item whose start column is already taken cannot share the row, so it drops to the next one and
// sits a column further along than the picture above it. Closing the overlap would stand the two
// side by side instead, which is a different section.
//
// Only the full-bleed steps name a ratio. The five-column ones take theirs from the picture — see
// below — so its absence here is deliberate rather than an omission.
const VARIANTS = [
	"col-span-full aspect-4/3",
	"col-span-8 col-start-2 md:col-start-2 md:col-span-6",
	"col-span-8 col-start-4 md:col-start-6 md:col-span-6",
	"col-span-full aspect-4/3",
	"col-span-8 col-start-4 md:col-start-6 md:col-span-6",
	"col-span-8 col-start-2 md:col-start-2 md:col-span-6"
]

// Which steps of the rhythm above hold five of the twelve columns rather than all of them, by index:
// the second and third, then the fifth and sixth. Two things follow from membership. The box takes
// its ratio from the picture inside it — a standing file gets 10/16, a lying one 16/10 — and it is
// requested at its own width instead of the viewport's.
//
// The full-bleed steps stay at 4/3 whatever they hold. A picture running the width of the page
// decides how much of the page it takes, and one that set its own height would make the shape of a
// work's gallery a matter of which files the editor happened to upload.
const NARROW_STEPS = new Set([1, 2, 4, 5])

// A work's gallery, full width, one picture under the next in the order the editor arranged them.
//
// title stands in for alt text wherever the editor left it blank: a gallery picture is content, not
// decoration, so an empty alt would hide it from a screen reader entirely.
export default function Gallery(
	{ images, title }:
		{ images: WorkGalleryImageType[], title: string }) {
	// Nothing to show, so no section — an empty one would still carry its row gaps into the page.
	if (images.length === 0) return null

	return (
		<section className="grid-standard gap-y-size-192">
			{
				images.map(({ _key, alt, media }, index) => {
					const narrow = NARROW_STEPS.has(index % VARIANTS.length)

					// Empty on the full-bleed steps, where the variant carries the ratio itself.
					const ratio = narrow
						? imageOrientation(media) === "portrait" ? "aspect-3/4" : "aspect-4/3"
						: ""

					return (
						// relative and overflow-hidden for the picture inside: fill positions it against
						// this box, and our Image starts its reveal scaled up, which would otherwise spill
						// past it.
						<div
							className={`bg-image-placeholder relative overflow-hidden ${variantAt(VARIANTS, index)} ${ratio}`}
							key={_key}>
							<Image
								src={buildImageUrl(media, HERO)}
								alt={alt ?? title}
								fill
								// Five of twelve columns, gutters taken off, is a little under 42vw — and the
								// grid holds its twelve columns at every width, so there is no breakpoint at
								// which either figure changes.
								sizes={narrow ? "42vw" : "100vw"}
								quality={99}
								className="object-cover" />
						</div>
					)
				})
			}
		</section>
	)
}
