import { Intersection } from "./intersections";
import { Shape } from "./shapes";
import { EPSILON, vector } from "./tuples";

class Plane extends Shape {
  constructor() {
    super();
  }

  local_intersect(ray) {
    if (Math.abs(ray.direction[1]) < EPSILON) {
      return [];
    }

    const t = -ray.origin[1] / ray.direction[1];
    return [new Intersection(t, this)];
  }

  local_normal_at(point, hit) {
    // the same normal everywhere
    return vector(0, 1, 0);
  }
}

export { Plane };
