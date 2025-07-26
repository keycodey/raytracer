import { hit, prepare_computations, schlick } from "./intersections";
import { lighting, Pointlight } from "./lights";
import { Material } from "./materials";
import { intersect, Ray } from "./rays";
import { Sphere } from "./spheres";
import { scaling } from "./transformations";
import {
  addColors,
  color,
  dot,
  magnitude,
  multiplyColorByScalar,
  normalize,
  point,
  scale,
  sub
} from "./tuples";

class World {
  constructor() {
    this.light = null;
    this.objects = [];
  }
}

const default_world = () => {
  const world = new World();
  world.light = new Pointlight(point(-10, 10, -10), color(1, 1, 1));
  const s1 = new Sphere("s1");
  const m = new Material();
  m.color = color(0.8, 1.0, 0.6);
  m.diffuse = 0.7;
  m.specular = 0.2;
  s1.material = m;
  const s2 = new Sphere("s2");
  s2.transform = scaling(0.5, 0.5, 0.5);
  world.objects = [s1, s2];
  return world;
};

const intersect_world = (w, r) => {
  let intersections = [];
  const objects = w.objects;

  objects.forEach((item) => {
    const xs = intersect(item, r);
    intersections = intersections.concat(xs);
  });

  intersections.sort(function (a, b) {
    return a.t - b.t;
  });

  return intersections;
};

const shade_hit = (world, comps, remaining) => {
  const shadowed = is_shadowed(world, comps.over_point);

  const surface = lighting(
    comps.object.material,
    comps.object,
    world.light,
    comps.over_point,
    comps.eyev,
    comps.normalv,
    shadowed
  );

  const reflected = reflected_color(world, comps, remaining);
  const refracted = refracted_color(world, comps, remaining);

  const material = comps.object.material;
  if (material.reflective > 0 && material.transparency > 0) {
    const reflectance = schlick(comps);
    return addColors(
      surface,
      addColors(
        multiplyColorByScalar(reflectance, reflected),
        multiplyColorByScalar(1 - reflectance, refracted)
      )
    );
  } else {
    return addColors(surface, addColors(reflected, refracted));
  }
};

const color_at = (world, ray, remaining) => {
  const intersections = intersect_world(world, ray);
  const hit_ = hit(intersections);

  if (hit_ == undefined) {
    return color(0, 0, 0);
  }

  const comps = prepare_computations(hit_, ray, intersections);
  return shade_hit(world, comps, remaining);
};

const is_shadowed = (world, point) => {
  const v = sub(world.light.position, point);
  const distance = magnitude(v);
  const direction = normalize(v);

  const r = new Ray(point, direction);
  const intersections = intersect_world(world, r);

  const h = hit(intersections);
  if (h != undefined && h.t < distance && h.object.material.casts_shadows) {
    return true;
  } else {
    return false;
  }
};

const reflected_color = (world, comps, remaining) => {
  if (remaining <= 0) {
    return color(0, 0, 0);
  }
  if (comps.object.material.reflective === 0) {
    return color(0, 0, 0);
  }

  const reflect_ray = new Ray(comps.over_point, comps.reflectv);
  const color_ = color_at(world, reflect_ray, remaining - 1);

  return multiplyColorByScalar(comps.object.material.reflective, color_);
};

const refracted_color = (world, comps, remaining) => {
  if (remaining <= 0) {
    return color(0, 0, 0);
  }
  if (comps.object.material.transparency === 0) {
    return color(0, 0, 0);
  }

  // find the ratio of first index of refraction to the second
  const n_ratio = comps.n1 / comps.n2;

  // cos(theta_i) is the same as the dot product of the two vectors
  const cos_i = dot(comps.eyev, comps.normalv);

  // find sin(theta_t)^2 via trigonometric identity
  const sin2_t = n_ratio ** 2 * (1 - cos_i ** 2);

  if (sin2_t > 1) {
    return color(0, 0, 0);
  }

  // find cos(theta_t) via trigonometric identity
  const cos_t = Math.sqrt(1.0 - sin2_t);

  // compute the direction of the refracted ray
  const direction = sub(
    scale(n_ratio * cos_i - cos_t, comps.normalv),
    scale(n_ratio, comps.eyev)
  );

  // create the refracted ray
  const refracted_ray = new Ray(comps.under_point, direction);

  // find the color of the refracted ray, making sure to multiply
  // by the transparency value to account for any opacity
  const color_ = multiplyColorByScalar(
    comps.object.material.transparency,
    color_at(world, refracted_ray, remaining - 1)
  );

  return color_;
};

export {
  World,
  default_world,
  intersect_world,
  shade_hit,
  color_at,
  is_shadowed,
  reflected_color,
  refracted_color
};
