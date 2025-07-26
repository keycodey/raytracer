import { Intersection } from "./intersections";
import { Shape } from "./shapes";
import { EPSILON, vector } from "./tuples";

class Cylinder extends Shape {
  constructor() {
    super();
    this.minimum = -Infinity;
    this.maximum = Infinity;
    this.closed = false;
  }

  local_intersect(ray) {
    const xs = [];

    const a = ray.direction[0] ** 2 + ray.direction[2] ** 2;

    // ray is parallel to the y axis
    if (Math.abs(a) < EPSILON) {
      intersect_caps(this, ray, xs);
      return xs;
    }

    const b =
      2 * ray.origin[0] * ray.direction[0] +
      2 * ray.origin[2] * ray.direction[2];

    const c = ray.origin[0] ** 2 + ray.origin[2] ** 2 - 1;

    const disc = b ** 2 - 4 * a * c;

    // ray does not intersect the cylinder
    if (disc < 0) {
      return [];
    }

    const t0 = (-b - Math.sqrt(disc)) / (2 * a);
    const t1 = (-b + Math.sqrt(disc)) / (2 * a);

    if (t0 > t1) {
      [t0, t1] = [t1, t0];
    }

    const y0 = ray.origin[1] + t0 * ray.direction[1];
    if (this.minimum < y0 && y0 < this.maximum) {
      xs.push(new Intersection(t0, this));
    }

    const y1 = ray.origin[1] + t1 * ray.direction[1];
    if (this.minimum < y1 && y1 < this.maximum) {
      xs.push(new Intersection(t1, this));
    }

    intersect_caps(this, ray, xs);

    return xs;
  }

  local_normal_at(local_point, hit) {
    // compute the square of the distance from the y axis
    const dist = local_point[0] ** 2 + local_point[2] ** 2;

    if (dist < 1 && local_point[1] >= this.maximum - EPSILON) {
      return vector(0, 1, 0);
    }

    if (dist < 1 && local_point[1] <= this.minimum + EPSILON) {
      return vector(0, -1, 0);
    }

    return vector(local_point[0], 0, local_point[2]);
  }
}

// helper function to reduce duplication
// checks to see if the intersections at 't' is within a radius
// of 1 (the radius of your cylinders) from the y axis
const check_cap = (ray, t) => {
  const x = ray.origin[0] + t * ray.direction[0];
  const z = ray.origin[2] + t * ray.direction[2];

  return x ** 2 + z ** 2 <= 1;
};

const intersect_caps = (cyl, ray, xs) => {
  // caps only matter if the cylinder is closed, and might possibly be
  // intersected by the ray
  if (!cyl.closed || Math.abs(ray.direction[1]) < EPSILON) {
    return;
  }

  // check for an intersection with the lower end cap by intersecting
  // the ray with the plane at y=cyl.minimum
  const tl = (cyl.minimum - ray.origin[1]) / ray.direction[1];
  if (check_cap(ray, tl)) {
    xs.push(new Intersection(tl, cyl));
  }

  // check for an intersection with the upper end cap by intersecting
  // the ray with the plane at y=cyl.maximum
  const tu = (cyl.maximum - ray.origin[1]) / ray.direction[1];
  if (check_cap(ray, tu)) {
    xs.push(new Intersection(tu, cyl));
  }
};

export { Cylinder };
