import { Intersection } from "./intersections";
import { Shape } from "./shapes";
import { EPSILON, vector } from "./tuples";

class Cube extends Shape {
  constructor() {
    super();
  }

  local_intersect(ray) {
    const [xtmin, xtmax] = this.check_axis(ray.origin[0], ray.direction[0]);
    if (xtmin > xtmax) return []; // minor optimization

    const [ytmin, ytmax] = this.check_axis(ray.origin[1], ray.direction[1]);
    if (ytmin > ytmax) return []; // minor optimization

    const [ztmin, ztmax] = this.check_axis(ray.origin[2], ray.direction[2]);

    const tmin = Math.max(xtmin, ytmin, ztmin);
    const tmax = Math.min(xtmax, ytmax, ztmax);

    if (tmin > tmax) {
      return [];
    }

    return [new Intersection(tmin, this), new Intersection(tmax, this)];
  }

  check_axis(origin, direction) {
    const tmin_numerator = -1 - origin;
    const tmax_numerator = 1 - origin;

    let tmin, tmax;

    if (Math.abs(direction) >= EPSILON) {
      tmin = tmin_numerator / direction;
      tmax = tmax_numerator / direction;
    } else {
      tmin = tmin_numerator * Infinity;
      tmax = tmax_numerator * Infinity;
    }

    if (tmin > tmax) {
      let temp_tmax = tmax;
      tmax = tmin;
      tmin = temp_tmax;
    }

    return [tmin, tmax];
  }

  local_normal_at(local_point, hit) {
    const maxc = Math.max(
      Math.abs(local_point[0]),
      Math.abs(local_point[1]),
      Math.abs(local_point[2])
    );

    if (maxc == Math.abs(local_point[0])) {
      return vector(local_point[0], 0, 0);
    } else if (maxc == Math.abs(local_point[1])) {
      return vector(0, local_point[1], 0);
    }

    return vector(0, 0, local_point[2]);
  }
}

export { Cube };
