import { intersection_with_uv } from "./intersections";
import { Shape } from "./shapes";
import { add, cross, dot, EPSILON, scale, sub } from "./tuples";

class SmoothTriangle extends Shape {
  constructor(p1, p2, p3, n1, n2, n3) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.e1 = sub(p2, p1);
    this.e2 = sub(p3, p1);
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

    const i = intersection_with_uv(t, this, u, v);
    return [i];
  }

  local_normal_at(point, hit) {
    return add(
      scale(hit.u, this.n2),
      add(scale(hit.v, this.n3), scale(1 - hit.u - hit.v, this.n1))
    );
  }
}

export { SmoothTriangle };
