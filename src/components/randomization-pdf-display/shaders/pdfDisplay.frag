uniform float uCurrentSettingValue;
uniform vec2 uUniformMinMax;
uniform vec2 uGaussMuSigma;
uniform vec2 uBetaAB;
uniform float uPertGamma;
uniform int uPdfType; // 0: Uniform, 1: Gaussian, 2: PERT (beta)

varying vec2 vUv;

#define PI2 6.283185

// Credit to Inigo Quilez for the palette function
// https://iquilezles.org/articles/palettes/
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(PI2 * (c * t + d));
}

vec3 getCosValues(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    vec3 values = vec3(0.0);

    values.x = cos((d.x + c.x * t) * PI2) * b.x * uYAmp + uYMid + (a.x - 0.5) * uYAmp;
    values.y = cos((d.y + c.y * t) * PI2) * b.y * uYAmp + uYMid + (a.y - 0.5) * uYAmp;
    values.z = cos((d.z + c.z * t) * PI2) * b.z * uYAmp + uYMid + (a.z - 0.5) * uYAmp;

    return values;
}

void main() {
    vec3 color = clamp(palette(vUv.x, uPaletteA, uPaletteB, uPaletteC, uPaletteD), 0.0, 1.0);

    float normY = vUv.y * uYMax;

    vec3 cosValues = clamp(getCosValues(vUv.x, uPaletteA, uPaletteB, uPaletteC, uPaletteD), uYMin, uYMax);

    gl_FragColor = vec4(color * ((1.0 - step(uYMin, normY)) * 0.75 + 0.25), uAlpha);

    vec3 normYMinusCosValues = abs(normY - cosValues);

    gl_FragColor.rgb += (1.0 - step(0.003, normYMinusCosValues)) * (step(uYMin, normY));

    // if (normYMinusCosValues.r > 1.0) {
    //     gl_FragColor.rgb = vec3(1.0);
    // }

    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}