import { createClient } from "next-sanity"

export const sanityClient = createClient({
    projectId: "7dil1d5q",
    dataset: "production",
    apiVersion: "2026-05-15",
    useCdn: false,
})