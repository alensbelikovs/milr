import { type PostType } from "@/types/ContentTypes"

// Sample data. This is hardcoded until posts are modelled in Sanity, and lives here rather than in
// any one section so the diary index and the featured strip cannot show two different sets of posts.
//
// `media` is null throughout: PostCard falls back to its placeholder, so the grid is laid out and
// browsable before a single image exists.
//
// Dates are fixed literals rather than `new Date()`. A date computed at module scope is a different
// value on the server than on the client, which is the shape of a hydration mismatch.
export const posts: PostType[] = [
	{
		title: "Three questions I ask before drawing anything",
		media: null,
		_createdAt: new Date("2025-08-14"),
		externalUrl: "#",
	},
	{
		title: "Why the hallway is the room worth fighting for",
		media: null,
		_createdAt: new Date("2025-08-02"),
		externalUrl: "#",
	},
	{
		title: "Choosing a floor you will still like in ten years",
		media: null,
		_createdAt: new Date("2025-07-21"),
		externalUrl: "#",
	},
	{
		title: "Light does more of the work than colour does",
		media: null,
		_createdAt: new Date("2025-07-09"),
		externalUrl: "#",
	},
	{
		title: "The case for one oversized thing in every room",
		media: null,
		_createdAt: new Date("2025-06-27"),
		externalUrl: "#",
	},
	{
		title: "How I read a plan before I ever see the site",
		media: null,
		_createdAt: new Date("2025-06-15"),
		externalUrl: "#",
	},
	{
		title: "Storage is a design problem, not a shopping list",
		media: null,
		_createdAt: new Date("2025-06-01"),
		externalUrl: "#",
	},
	{
		title: "Where to spend and where to hold back",
		media: null,
		_createdAt: new Date("2025-05-19"),
		externalUrl: "#",
	},
	{
		title: "Small kitchens that do not feel small",
		media: null,
		_createdAt: new Date("2025-05-06"),
		externalUrl: "#",
	},
	{
		title: "A room is finished when you stop noticing it",
		media: null,
		_createdAt: new Date("2025-04-24"),
		externalUrl: "#",
	},
	{
		title: "Texture is the part photographs never carry",
		media: null,
		_createdAt: new Date("2025-04-11"),
		externalUrl: "#",
	},
	{
		title: "Living with a colour before committing to it",
		media: null,
		_createdAt: new Date("2025-03-30"),
		externalUrl: "#",
	},
	{
		title: "The furniture you should buy last",
		media: null,
		_createdAt: new Date("2025-03-17"),
		externalUrl: "#",
	},
	{
		title: "Windows set the schedule for everything else",
		media: null,
		_createdAt: new Date("2025-03-04"),
		externalUrl: "#",
	},
	{
		title: "What a mood board is actually for",
		media: null,
		_createdAt: new Date("2025-02-20"),
		externalUrl: "#",
	},
	{
		title: "Renting is not a reason to settle",
		media: null,
		_createdAt: new Date("2025-02-07"),
		externalUrl: "#",
	},
]

// How many posts one page of the diary index shows. Kept beside the data it slices so the count and
// the list cannot drift apart, and so the same number reaches the grid and — once paging is wired
// up — whatever computes the page count.
export const POSTS_PER_PAGE = 12

// The first page, which is all the index renders until Pagination is more than a placeholder.
export const postsPage: PostType[] = posts.slice(0, POSTS_PER_PAGE)
