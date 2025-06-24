import * as THREE from "three";
import fragmentShader from "./shaders/agent-positions/agentPositions.frag";
import vertexShader from "./shaders/agent-positions/agentPositions.vert";

class AgentPositionsMaterial extends THREE.ShaderMaterial {
  constructor(uniforms: { [uniform: string]: THREE.IUniform }) {
    super({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default AgentPositionsMaterial;
