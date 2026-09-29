import type { NextConfig } from "next";

const shaderRule = {
	loaders: ["./loaders/glsl-loader.js"],
	as: "*.js",
};

const nextConfig: NextConfig = {
	// `next dev` serves on every interface but only trusts localhost, so opening the printed Network
	// URL from a phone or a second machine gets every /_next/* chunk and the HMR socket answered with
	// 403 — the page arrives as server HTML that never hydrates, so the WebGL scenes never mount.
	// Wildcarding the last octet keeps this working when the router hands out a different lease.
	allowedDevOrigins: ["192.168.8.*"],
	images: {
		// Project covers come back from getProjects as cdn.sanity.io URLs, and next/image refuses any
		// remote host it has not been told about.
		remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
		// Every <Image> here asks for 99. Next only builds the qualities it is told about and warns
		// about any other, so the list has to name it — 75 stays for anything that does not ask.
		qualities: [75, 99],
	},
	turbopack: {
		rules: {
			// Import shader sources as strings.
			"*.glsl": shaderRule,
			"*.vert": shaderRule,
			"*.frag": shaderRule,
		},
	},
};

export default nextConfig;
