import * as THREE from "three";
import fragmentShader from "./shaders/agent-data/agentData.frag";
import vertexShader from "./shaders/agent-data/agentData.vert";

class AgentDataMaterial extends THREE.ShaderMaterial {
  constructor(uniforms: { [uniform: string]: THREE.IUniform }) {
    super({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default AgentDataMaterial;
