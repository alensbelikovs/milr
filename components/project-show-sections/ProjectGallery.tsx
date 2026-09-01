import CardGrid from "@/components/common/CardGrid"
import ProjectShowGridItem from "@/components/common/ProjectShowGridItem"
import type { ProjectGalleryImageType } from "@/types/ContentTypes"
import { GRID_CONTAINER, GRID_CYCLE_SPACER, PROJECT_VARIANTS } from "@/utils/gridVariants"

// A project's own images, laid out on the same rhythm /projects lays its cards on. Deliberately the
// same and not merely similar: a reader arriving here from that grid has just scrolled through this
// exact pattern, and a gallery with a shape of its own would read as a different site rather than as
// the same one going deeper.
//
// Which is why the container and the cycle break come from gridVariants too, not just the variants.
// The rhythm alone would place the images and still leave the gutters, the row gaps and the break
// between passes free to drift away from the page that inspired them.
//
// Nothing when there is nothing: the field is optional in the schema — see SCHEMA.md — and the query
// coalesces a missing one to [], so an empty array is the ordinary case rather than a fault. A
// section heading over no images would be worse than no section.
//
// getKey reads _key, which is the only identity a gallery image has. It is an inline array entry on
// the project rather than a document, so there is no slug to reach for.
export default function ProjectGallery({ gallery }: { gallery: ProjectGalleryImageType[] }) {
	if (gallery.length === 0) return null

	return (
		<section className="px-regular bg-background relative z-1">
			<CardGrid
				items={gallery}
				variants={PROJECT_VARIANTS}
				className={GRID_CONTAINER}
				cycleSpacer={GRID_CYCLE_SPACER}
				getKey={image => image._key}
				renderCard={(image, cardClassName) => (
					<ProjectShowGridItem img={image.img} className={cardClassName} />
				)} />
		</section>
	)
}
