import { color } from "./tuples";

class Material {
  constructor() {
    this.color = color(1, 1, 1);
    this.ambient = 0.1;
    this.diffuse = 0.9;
    this.specular = 0.9;
    this.shininess = 200.0;
    this.pattern = null;
    this.reflective = 0.0;
    this.transparency = 0.0;
    this.refractive_index = 1.0;
    this.casts_shadows = true;
  }
}

export { Material };
