"use server"
import { sanityClient } from "@/utils/sanityClient"
import { WORK_FILTER } from "@/utils/sanityGetters"

// How many works match the staged filters, for the filter sidebar's submit button.
export async function countWork(sectors: string[], solutions: string[], featured: boolean) {
	return await sanityClient.fetch<number>(`count(*[${WORK_FILTER}])`, { sectors, solutions, featured })
}
