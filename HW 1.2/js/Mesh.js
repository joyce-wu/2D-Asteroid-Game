"use strict";
/* exported Mesh */
class Mesh extends UniformProvider {
  constructor(material, geometry) {
    super("mesh");
    this.material = material;
    this.geometry = geometry;
    this.addComponentsAndGatherUniforms(material, geometry);
  }

}
