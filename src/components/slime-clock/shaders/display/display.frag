uniform sampler2D uTrailTexture;
uniform sampler2D uClockTexture;
uniform vec2 uDisplayTextureResolution;
uniform float uTime;
uniform vec3 uPaletteA;
uniform vec3 uPaletteB;
uniform vec3 uPaletteC;
uniform vec3 uPaletteD;
uniform float uShowClockShadow;
uniform float uClockShadowOpacity;
uniform vec3 uClockShadowColor;
uniform float uIntensitySmoothing;
uniform float uAgentDirectionSmoothing;
uniform float uAgentDirectionColorOffset;
uniform float uClockColorOffset;
uniform float uXColorOffset;
uniform float uYColorOffset;
uniform float uPaletteCycleTime;
uniform float uPaletteCycleScale;
uniform int uPaletteCycleType; // 0: Oscilating, 1: Repeating, 2: Continuous

varying vec2 vUv;

#define PI2 6.28318

vec3 palette(float t) {
    return uPaletteA + uPaletteB * cos(PI2 * (uPaletteC * t + uPaletteD));
}

void main() {
    vec4 trailData = texture2D(uTrailTexture, vUv);
    vec4 clockData = texture2D(uClockTexture, vUv);
    // vec4 agentPositionData = texture2D(uAgentPositionsTexture, vUv);

    float intensity = trailData.x;
    float lastAgentDirection = trailData.y;

    float avgIntensity = 0.0;
    float avgLastAgentDirection = 0.0;
    for (float i = -2.0; i <= 2.0; i++) {
        for (float j = -2.0; j <= 2.0; j++) {
            vec2 offset = vec2(i, j) / uDisplayTextureResolution;
            vec4 neighborData = texture2D(uTrailTexture, vUv + offset);
            avgIntensity += neighborData.x;
            avgLastAgentDirection += neighborData.y;
        }
    }
    avgIntensity *= 0.04;
    avgLastAgentDirection *= 0.04;

    float smoothedIntensity = mix(intensity, avgIntensity, uIntensitySmoothing);
    float smoothedAgentDirection = mix(lastAgentDirection, avgLastAgentDirection, uAgentDirectionSmoothing);
    // float paletteValue = (smoothedIntensity - 0.5) * 2.0;
    float paletteValue = smoothedIntensity;

    // Alrighty. Just going to ensure that the offset uniforms are in range [-1.0, 1.0]
    // before passing them to the shader.
    paletteValue += smoothedAgentDirection * uAgentDirectionColorOffset;
    paletteValue += vUv.x * uXColorOffset;
    paletteValue += vUv.y * uYColorOffset;

    // paletteValue /= (1.0 + abs(uAgentDirectionColorOffset) + abs(uXColorOffset) + abs(uYColorOffset));

    // paletteValue = paletteValue * 0.5 + 0.5;

    paletteValue += clockData.x * uClockColorOffset;

    paletteValue += uPaletteCycleTime;

    // TODO: Double-check if this is where I want to put the palette cycle scale.
    paletteValue *= uPaletteCycleScale;

    if (uPaletteCycleType == 0) {
        paletteValue = sin(paletteValue * PI2) * 0.5 + 0.5;
    } else if (uPaletteCycleType == 1) {
        paletteValue = mod(paletteValue, 1.0);
    }
    // No `else if` for continuous.

    // vec3 color = palette(mod((avgIntensity + avgLastAgentDirection * 0.2 + uTime * 0.05 + (vUv.x + vUv.y) * 0.5) * 0.2, 1.0)) * (avgIntensity * (intensity * 0.5 + 0.3));
    // vec3 color = palette(mod((avgIntensity + clockData.x * 0.5 + avgLastAgentDirection * 0.2 + uPaletteCycleTime + (vUv.x + vUv.y) * 0.5) * 0.2, 1.0)) * (avgIntensity * (intensity * 0.5 + 0.3));
    // vec3 color = palette(mod((avgIntensity + clockData.x * 0.5 + avgLastAgentDirection * 0.2 + uPaletteCycleTime + (vUv.x + vUv.y) * 0.5) * 0.2, 1.0));
    // vec3 color = palette(mod((paletteValue + uPaletteCycleTime + (vUv.x + vUv.y) * 0.5) * 0.2, 1.0)) * smoothedIntensity;

    vec3 color = palette(paletteValue) * smoothedIntensity;

    // gl_FragColor = vec4(mix(color, uClockShadowColor, uShowClockShadow * clockData.x * uClockShadowOpacity), avgIntensity);
    gl_FragColor = clamp(mix(vec4(color, smoothedIntensity), vec4(uClockShadowColor, 1.0), uShowClockShadow * clockData.x * uClockShadowOpacity), 0.0, 1.0);
    // gl_FragColor = vec4(color, smoothedIntensity);
}