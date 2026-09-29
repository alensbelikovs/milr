import type { ServiceType } from "@/types/ContentTypes"

// Sample data, and nothing imports it any more: services are `service` documents in Sanity now and
// the section is built from getServices. Kept as the shape a service has when it is written by hand
// — delete it once nothing wants that.
//
// description is what the sidebar shows when a service is opened — a few lines, no more, since it
// sits above a picture in a panel that should not need scrolling to reach it.
//
// media is the two placeholders under /public, alternating, so hovering from one row to the next
// shows a different picture arriving. A leading slash is read as a local path — see ServicesList.
export const SERVICES: ServiceType[] = [
	{
		title: "Full Space Design",
		description: "Every room planned as one — layout, light, materials and furniture decided together, so nothing in the finished space feels like it arrived on its own.",
		media: "/placeholder.png",
	},
	{
		title: "Interior Refinement",
		description: "For spaces that already work but don't feel finished. A handful of deliberate changes that make a room feel resolved, without starting over.",
		media: "/placeholder2.png",
	},
	{
		title: "Space Planning & Layouts",
		description: "Where walls, doors and furniture go, decided around how you actually move through a day. No finish can rescue a room that is laid out wrong.",
		media: "/placeholder.png",
	},
	{
		title: "Residential Interior Design",
		description: "Homes shaped around the people who live in them — their routines, their habits, the things they want to come back to at the end of a day.",
		media: "/placeholder2.png",
	},
	{
		title: "Commercial Interior Design",
		description: "Offices, shops and hospitality spaces that work as hard as the business in them — clear to move through, comfortable to stay in.",
		media: "/placeholder.png",
	},
	{
		title: "Lighting & Atmosphere Design",
		description: "Light planned in layers, for working, for evenings, and for the moments in between. Most of how a room feels comes down to where the light falls.",
		media: "/placeholder2.png",
	},
	{
		title: "3D Visualization",
		description: "Photorealistic renders of the finished space before anything is built or bought, so every decision is made looking at it rather than imagining it.",
		media: "/placeholder.png",
	},
	{
		title: "Installation Oversight",
		description: "On site through installation, checking every detail against the plan, so the finished room matches what was designed — down to the last switch.",
		media: "/placeholder2.png",
	},
]
