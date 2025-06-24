import * as THREE from "three";
import fragmentShader from "./shaders/trail/trail.frag";
import vertexShader from "./shaders/trail/trail.vert";

class TrailMaterial extends THREE.ShaderMaterial {
  constructor(uniforms: { [uniform: string]: THREE.IUniform }) {
    super({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default TrailMaterial;
