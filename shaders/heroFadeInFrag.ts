export const HERO_FADE_IN_FRAG = `
	uniform sampler2D uTexture;
	uniform float uPlaneAspect;
	uniform float uImageAspect;
	uniform float uRadius;
	uniform float uLumaDisplace;
	uniform float uFalloff;
	uniform vec2 uOrigin;
	uniform float uSkew;
	uniform float uScale;

	varying vec2 vUv;

	const vec3 LUMA_WEIGHTS = vec3(0.2126, 0.7152, 0.0722);

	const float MIN_HALF_BAND = 1e-5;

	vec2 sweepSpace(vec2 point) {
		vec2 q = (point - uOrigin) * vec2(uPlaneAspect, 1.0);
		q.x -= q.y * uSkew;
		return q;
	}

	void main() {
		vec2 range = uPlaneAspect > uImageAspect
			? vec2(1.0, uImageAspect / uPlaneAspect)
			: vec2(uPlaneAspect / uImageAspect, 1.0);

		vec2 uv = (vUv - 0.5) * range / uScale + 0.5;

		vec4 encoded = texture2D(uTexture, uv);

		float luma = dot(encoded.rgb, LUMA_WEIGHTS);

		vec4 texel = sRGBTransferEOTF(encoded);

		float dist = length(sweepSpace(vUv));

		float front = dist + (1.0 - luma) * uLumaDisplace;

		float halfBand = max(uFalloff * 0.5, MIN_HALF_BAND);

		float maxDist = max(
			max(length(sweepSpace(vec2(0.0, 0.0))), length(sweepSpace(vec2(1.0, 0.0)))),
			max(length(sweepSpace(vec2(0.0, 1.0))), length(sweepSpace(vec2(1.0, 1.0))))
		);

		float maxFront = maxDist + uLumaDisplace;

		float edge = mix(-halfBand, maxFront + halfBand, uRadius);

		float mask = smoothstep(edge - halfBand, edge + halfBand, front);

		gl_FragColor = vec4(mix(texel.rgb, vec3(1.0), mask), texel.a);
		#include <colorspace_fragment>
	}
`
