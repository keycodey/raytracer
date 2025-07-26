import { inverse } from "./matrices";
import { intersect, transform } from "./rays";
import { Shape } from "./shapes";

class Group extends Shape {
  constructor() {
    super();
    this.shapes = [];
    this.material = null; // if material is set, children inherit it
  }

  local_intersect(ray) {
    const xs = [];

    this.shapes.forEach((shape) => {
      const sxs = intersect(shape, ray);
      xs.push(...sxs);
    });

    xs.sort(function (a, b) {
      return a.t - b.t;
    });

    return xs;
  }

  local_normal_at(local_point, hit) {
    // normals are always computed by local_normal_at() of the concrete shapes
    throw new Error(
      "Invoked group.local_normal_at(). There is a bug in the code."
    );
  }
}

const group = () => {
  return new Group();
};

const add_child = (group, shape) => {
  shape.parent = group;
  // inherit parent's material
  if (group.material != null) {
    shape.material = group.material;
  }
  group.shapes.push(shape);
};

export { Group, group, add_child };
