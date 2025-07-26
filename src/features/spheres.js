import { Intersection } from "./intersections";
import { Shape } from "./shapes";
import { dot, normalize, point, sub } from "./tuples";

class Sphere extends Shape {
  constructor(id) {
    super();
    this.id = id;
  }

  local_intersect(ray) {
    // the vector from the sphere's center, to the ray origin
    // note: the sphere is centered at the world origin
    const sphere_to_ray = sub(ray.origin, point(0, 0, 0));

    const a = dot(ray.direction, ray.direction);
    const b = 2 * dot(ray.direction, sphere_to_ray);
    const c = dot(sphere_to_ray, sphere_to_ray) - 1;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    if (t1 <= t2) {
      return [new Intersection(t1, this), new Intersection(t2, this)];
    }

    return [new Intersection(t2, this), new Intersection(t1, this)];
  }

  local_normal_at(local_point, hit) {
    const object_normal = sub(local_point, point(0, 0, 0));
    object_normal[3] = 0;
    return normalize(object_normal);
  }
}

const glass_sphere = () => {
  const s = new Sphere();
  s.material.transparency = 1.0;
  s.material.refractive_index = 1.5;
  return s;
};

export { Sphere, glass_sphere };
