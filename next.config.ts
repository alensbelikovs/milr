import type { NextConfig } from "next";

const shaderRule = {
	loaders: ["./loaders/glsl-loader.js"],
	as: "*.js",
};

const nextConfig: NextConfig = {
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
