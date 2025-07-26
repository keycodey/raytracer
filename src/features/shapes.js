import { Material } from "./materials";
import {
  identity_matrix,
  inverse,
  matrix_vector_multiply,
  transpose
} from "./matrices";
import { normalize, vector } from "./tuples";

class Shape {
  constructor(id) {
    if (new.target === Shape) {
      throw new TypeError("TypeError: instantiating Shape.");
    }
    this.transform = identity_matrix();
    this.material = new Material();
    this.parent = undefined;
  }

  local_intersect(ray) {
    throw new Error("Method local_intersect must be implemented.");
  }

  local_normal_at(point, hit) {
    throw new Error("Method local_normal_at must be implemented.");
  }
}

class TestShape extends Shape {
  constructor() {
    super();
  }

  local_intersect(ray) {
    this.saved_ray = ray;
    return [];
  }

  local_normal_at(point, hit) {
    const local_normal_at = vector(point[0], point[1], point[2]);
    return local_normal_at;
  }
}

const set_transform = (shape, transform) => {
  shape.transform = transform;
};

const test_shape = () => {
  return new TestShape();
};

const world_to_object = (shape, point) => {
  if (shape.parent != undefined) {
    point = world_to_object(shape.parent, point);
  }

  return matrix_vector_multiply(inverse(shape.transform), point);
};

const normal_to_world = (shape, normal_) => {
  let normal = matrix_vector_multiply(
    transpose(inverse(shape.transform)),
    normal_
  );

  normal[3] = 0; // set w=0 in [x,y,z,w]; making sure normal is a vector
  normal = normalize(normal);

  if (shape.parent != undefined) {
    normal = normal_to_world(shape.parent, normal);
  }

  return normal;
};

export { Shape, test_shape, set_transform, world_to_object, normal_to_world };
