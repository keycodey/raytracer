import _ from "lodash";
import { normal_at, position } from "./rays";
import { add, dot, negate, reflect, scale, sub } from "./tuples";

const EPSILON = 0.00001;

class Intersection {
  constructor(t, object) {
    this.t = t;
    this.object = object;
    this.u = undefined;
    this.v = undefined;
  }
}

const intersection_with_uv = (t, shape, u, v) => {
  const i = new Intersection(t, shape);
  i.u = u;
  i.v = v;
  return i;
};

class Computations {
  t;
  object;
  point;
  eyev;
  normalv;
  inside;
  over_point;
  under_point;
  reflectv;
  n1;
  n2;
  constructor() {}
}

// rest parameters ...args => args are placed within an array
const intersections = (...args) => {
  return args;
};

const hit = (intersections) => {
  intersections.sort(function (a, b) {
    return a.t - b.t;
  });

  // returns undefined if there are no nonnegative elements
  return intersections.find((element) => element.t >= 0);
};

const prepare_computations = (intersection, ray, xs) => {
  // instantiate a data structure for storing some precomputed values
  const comps = new Computations();

  // copy the intersection's properties, for convenience
  comps.t = intersection.t;
  comps.object = intersection.object;

  // precompute some useful values
  comps.point = position(ray, comps.t);
  comps.eyev = negate(ray.direction);
  comps.normalv = normal_at(comps.object, comps.point, xs[0]);

  if (dot(comps.normalv, comps.eyev) < 0) {
    comps.inside = true;
    comps.normalv = negate(comps.normalv);
  } else {
    comps.inside = false;
  }

  comps.over_point = add(comps.point, scale(EPSILON, comps.normalv));
  comps.under_point = sub(comps.point, scale(EPSILON, comps.normalv));
  comps.reflectv = reflect(ray.direction, comps.normalv);

  const containers = [];

  for (let index = 0; index < xs.length; index++) {
    const i = xs[index];

    // i = hit
    if (_.isEqual(i, intersection)) {
      if (containers.length == 0) {
        comps.n1 = 1.0;
      } else {
        comps.n1 = containers[containers.length - 1].material.refractive_index;
      }
    }

    if (containers.includes(i.object)) {
      const index = containers.indexOf(i.object);
      containers.splice(index, 1);
    } else {
      containers.push(i.object);
    }

    // i = hit
    if (_.isEqual(i, intersection)) {
      if (containers.length == 0) {
        comps.n2 = 1.0;
      } else {
        comps.n2 = containers[containers.length - 1].material.refractive_index;
      }

      // terminate loop
      break;
    }
  }

  return comps;
};

const schlick = (comps) => {
  // find the cosine of the angle between the eye and normal vectors
  let cos = dot(comps.eyev, comps.normalv);

  // total internal reflection can only occur if n1 > n2
  if (comps.n1 > comps.n2) {
    const n = comps.n1 / comps.n2;
    const sin2_t = n ** 2 * (1.0 - cos ** 2);
    if (sin2_t > 1.0) {
      return 1.0;
    }

    // compute cosine of theta_t using trig identity
    const cos_t = Math.sqrt(1.0 - sin2_t);

    // when n1 > n2, use cos(theta_t) instead
    cos = cos_t;
  }

  const r0 = ((comps.n1 - comps.n2) / (comps.n1 + comps.n2)) ** 2;
  return r0 + (1 - r0) * (1 - cos) ** 5;
};

export {
  Intersection,
  intersection_with_uv,
  intersections,
  hit,
  prepare_computations,
  schlick
};
