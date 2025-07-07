varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position.xyz, 1.0) * vec4(2.0, 2.0, 1.0, 1.0);
}