import { Intersection } from "./intersections";
import { Shape } from "./shapes";
import { cross, dot, EPSILON, normalize, scale, sub } from "./tuples";

class Triangle extends Shape {
  constructor(p1, p2, p3) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.e1 = sub(p2, p1);
    this.e2 = sub(p3, p1);
    this.normal = normalize(cross(this.e2, this.e1));
  }

  local_intersect(ray) {
    const dir_cross_e2 = cross(ray.direction, this.e2);
    const det = dot(this.e1, dir_cross_e2);

    if (Math.abs(det) < EPSILON) {
      return [];
    }

    const f = 1.0 / det;
    const p1_to_origin = sub(ray.origin, this.p1);
    const u = f * dot(p1_to_origin, dir_cross_e2);

    if (u < 0 || u > 1) {
      return [];
    }

    const origin_cross_e1 = cross(p1_to_origin, this.e1);
    const v = f * dot(ray.direction, origin_cross_e1);

    if (v < 0 || u + v > 1) {
      return [];
    }

    const t = f * dot(this.e2, origin_cross_e1);
    return [new Intersection(t, this)];
  }

  local_normal_at(point, hit) {
    return this.normal;
  }
}

export { Triangle };
