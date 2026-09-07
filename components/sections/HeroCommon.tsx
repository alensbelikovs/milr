import DetailList from "@/components/general/DetailList"
import BodyLink from "@/components/actions/BodyLink"

// Doesn't use semantic <Section/> component,
// since not included in <SectionNav/>
// and has different styling
export default function HeroCommon(
	{ heading, subheading, category, type, published }:
		{
			heading: string;
			subheading: string;
			category?: string;
			type?: string;
			published?: string
		}
) {
	return (
		<section className="text-background bg-foreground grid-standard relative min-h-screen py-size-24">
			<h1 className="text-size-72 row-start-1 col-span-6 self-center">{heading}</h1>
			<h2 className="text-size-24 row-start-1 col-start-7 col-span-2 self-center">{subheading}</h2>
			{
				(category || type || published) &&
				<div className="self-end row-start-1 grid grid-cols-6 col-start-7 col-span-7 gap-size-24">
					{
						category &&
						<DetailList
							label="Category"
							className="col-span-2"
						>
						<li><BodyLink href={`/projects/${category}`}>{category}</BodyLink></li>
						</DetailList>
					}
					{
						type &&
						<DetailList
							label="Type"
							className="col-span-2"
						>
						<li><BodyLink href={`/projects/${type}`}>{type}</BodyLink></li>
						</DetailList>
					}
					{
						published &&
						<DetailList
							label="Published"
							className="col-span-2"
						>
						<li>{published}</li>
						</DetailList>
					}
				</div>
			}
		</section>
	)
}
