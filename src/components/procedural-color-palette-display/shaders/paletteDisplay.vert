uniform vec2 uDisplayScale;

varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position.xy + vec2(0, 0.35), 0.0, 1.0) * vec4(uDisplayScale.xy * 1.5, 1.0, 1.0);
}