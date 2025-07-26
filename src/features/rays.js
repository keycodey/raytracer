import { inverse, matrix_vector_multiply } from "./matrices";
import { normal_to_world, world_to_object } from "./shapes";
import { add, scale } from "./tuples";

class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }
}

const position = (ray, t) => {
  return add(ray.origin, scale(t, ray.direction));
};

const intersect = (shape, ray) => {
  const local_ray = transform(ray, inverse(shape.transform));
  return shape.local_intersect(local_ray);
};

const normal_at = (shape, world_point, intersection) => {
  const local_point = world_to_object(shape, world_point);
  const local_normal = shape.local_normal_at(local_point, intersection);

  return normal_to_world(shape, local_normal);
};

const transform = (ray, matrix) => {
  const origin = matrix_vector_multiply(matrix, ray.origin);
  const direction = matrix_vector_multiply(matrix, ray.direction);

  return new Ray(origin, direction);
};

export { Ray, position, intersect, transform, normal_at };
