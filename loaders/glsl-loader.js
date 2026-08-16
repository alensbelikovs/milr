/**
 * Turbopack/webpack loader that turns a shader file into a JS module
 * exporting its source as a string.
 *
 * Registered for *.glsl / *.vert / *.frag in next.config.ts.
 */
module.exports = function glslLoader(source) {
	return `export default ${JSON.stringify(source)}`
}
