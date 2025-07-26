import {
  Intersection,
  intersections,
  prepare_computations
} from "../features/intersections";
import { Pointlight } from "../features/lights";
import { test_pattern } from "../features/patterns";
import { Plane } from "../features/planes";
import { Ray } from "../features/rays";
import { Sphere } from "../features/spheres";
import { scaling, translation } from "../features/transformations";
import { color, point, vector } from "../features/tuples";
import {
  color_at,
  default_world,
  intersect_world,
  shade_hit,
  World,
  is_shadowed,
  reflected_color,
  refracted_color
} from "../features/world";

test("Creating a world", () => {
  const w = new World();
  expect(w.objects.length).toBe(0);
  expect(w.light).toBeNull();
});

test("The default world", () => {
  const light = new Pointlight(point(-10, 10, -10), color(1, 1, 1));
  const s1 = new Sphere("s1");
  s1.material.color = color(0.8, 1.0, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  const s2 = new Sphere("s2");
  s2.transform = scaling(0.5, 0.5, 0.5);
  const w = default_world();
  expect(w.light).toStrictEqual(light);
  expect(w.objects).toContainEqual(s1);
  expect(w.objects).toContainEqual(s2);
});

test("Intersect a world with a ray", () => {
  const w = default_world();
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = intersect_world(w, r);
  expect(xs.length).toBe(4);
  expect(xs[0].t).toBe(4);
  expect(xs[1].t).toBe(4.5);
  expect(xs[2].t).toBe(5.5);
  expect(xs[3].t).toBe(6);
});

test("Shading an intersection", () => {
  const w = default_world();
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const shape = w.objects[0];
  const i = new Intersection(4, shape);
  const comps = prepare_computations(i, r, [i]);
  const c = shade_hit(w, comps, 4);
  // expect(c).toStrictEqual(color(0.38066, 0.47583, 0.2855));
  expect(c[0]).toBeCloseTo(0.38066, 5);
  expect(c[1]).toBeCloseTo(0.47583, 5);
  expect(c[2]).toBeCloseTo(0.2855, 5);
});

test("Shading an intersection from the inside", () => {
  const w = default_world();
  w.light = new Pointlight(point(0, 0.25, 0), color(1, 1, 1));
  const r = new Ray(point(0, 0, 0), vector(0, 0, 1));
  const shape = w.objects[1];
  const i = new Intersection(0.5, shape);
  const comps = prepare_computations(i, r, [i]);
  const c = shade_hit(w, comps, 4);
  // expect(c).toStrictEqual(color(0.38066, 0.47583, 0.2855));
  expect(c[0]).toBeCloseTo(0.90498, 5);
  expect(c[1]).toBeCloseTo(0.90498, 5);
  expect(c[2]).toBeCloseTo(0.90498, 5);
});

test("The color when a ray misses", () => {
  const w = default_world();
  const r = new Ray(point(0, 0, -5), vector(0, 1, 0));
  const c = color_at(w, r, 4);
  expect(c).toStrictEqual(color(0, 0, 0));
});

test("The color when a ray hits", () => {
  const w = default_world();
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const c = color_at(w, r, 4);
  expect(c[0]).toBeCloseTo(0.38066, 5);
  expect(c[1]).toBeCloseTo(0.47583, 5);
  expect(c[2]).toBeCloseTo(0.2855, 5);
});

test("The color with an intersection behind the ray", () => {
  const w = default_world();
  const outer = w.objects[0];
  outer.material.ambient = 1;
  const inner = w.objects[1];
  inner.material.ambient = 1;
  const r = new Ray(point(0, 0, 0.75), vector(0, 0, -1));
  const c = color_at(w, r, 4);
  expect(c[0]).toBeCloseTo(inner.material.color[0], 5);
  expect(c[1]).toBeCloseTo(inner.material.color[1], 5);
  expect(c[2]).toBeCloseTo(inner.material.color[2], 5);
});

test("There is no shadow when nothing is collinear with point and light", () => {
  const w = default_world();
  const p = point(0, 10, 0);
  expect(is_shadowed(w, p)).toBe(false);
});

test("The shadow when an object is between the point and the light", () => {
  const w = default_world();
  const p = point(10, -10, 10);
  expect(is_shadowed(w, p)).toBe(true);
});

test("There is no shadow when an object is behind the light", () => {
  const w = default_world();
  const p = point(-20, 20, -20);
  expect(is_shadowed(w, p)).toBe(false);
});

test("There is no shadow when an object is behind the point", () => {
  const w = default_world();
  const p = point(-2, 2, -2);
  expect(is_shadowed(w, p)).toBe(false);
});

test("shade_hit() is given an intersection in shadow", () => {
  const w = new World();
  w.light = new Pointlight(point(0, 0, -10), color(1, 1, 1));
  const s1 = new Sphere("s1");
  w.objects.push(s1);
  const s2 = new Sphere("s2");
  s2.transform = translation(0, 0, 10);
  w.objects.push(s2);
  const r = new Ray(point(0, 0, 5), vector(0, 0, 1));
  const i = new Intersection(4, s2);
  const comps = prepare_computations(i, r, [i]);
  const c = shade_hit(w, comps, 4);
  expect(c[0]).toBeCloseTo(0.1, 5);
  expect(c[1]).toBeCloseTo(0.1, 5);
  expect(c[2]).toBeCloseTo(0.1, 5);
});

test("The reflected color for a nonreflective material", () => {
  const w = default_world();
  const r = new Ray(point(0, 0, 0), vector(0, 0, 1));
  const shape = w.objects[1];
  shape.material.ambient = 1;
  const i = new Intersection(1, shape);
  const comps = prepare_computations(i, r, [i]);
  const color_ = reflected_color(w, comps, 4);
  expect(color_).toStrictEqual(color(0, 0, 0));
});

test("The reflected color for a reflective material", () => {
  const w = default_world();
  const shape = new Plane();
  shape.material.reflective = 0.5;
  shape.transform = translation(0, -1, 0);
  w.objects.push(shape);
  const r = new Ray(
    point(0, 0, -3),
    vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  const i = new Intersection(Math.sqrt(2), shape);
  const comps = prepare_computations(i, r, [i]);
  const color_ = reflected_color(w, comps, 4);
  expect(color_[0]).toBeCloseTo(0.19032, 4);
  expect(color_[1]).toBeCloseTo(0.2379, 4);
  expect(color_[2]).toBeCloseTo(0.14274, 4);
});

test("shade_hit() with a reflective material", () => {
  const w = default_world();
  const shape = new Plane();
  shape.material.reflective = 0.5;
  shape.transform = translation(0, -1, 0);
  w.objects.push(shape);
  const r = new Ray(
    point(0, 0, -3),
    vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  const i = new Intersection(Math.sqrt(2), shape);
  const comps = prepare_computations(i, r, [i]);
  const color_ = shade_hit(w, comps, 4);
  expect(color_[0]).toBeCloseTo(0.87688, 3);
  expect(color_[1]).toBeCloseTo(0.92436, 4);
  expect(color_[2]).toBeCloseTo(0.82918, 4);
});

test("color_at() with mutually reflective surfaces", () => {
  const w = new World();
  w.light = new Pointlight(point(0, 0, 0), color(1, 1, 1));
  const lower = new Plane();
  lower.material.reflective = 1;
  lower.transform = translation(0, -1, 0);
  w.objects.push(lower);
  const upper = new Plane();
  upper.material.reflective = 1;
  upper.transform = translation(0, 1, 0);
  w.objects.push(upper);
  const r = new Ray(point(0, 0, 0), vector(0, 1, 0));
  const c = color_at(w, r, 5);
  expect(c[0]).toBeCloseTo(11.4, 3); // color_at() should terminate successfully
});

test("The reflected color at the maximum recursive depth", () => {
  const w = default_world();
  const shape = new Plane();
  shape.material.reflective = 0.5;
  shape.transform = translation(0, -1, 0);
  w.objects.push(shape);
  const r = new Ray(
    point(0, 0, -3),
    vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  const i = new Intersection(Math.sqrt(2), shape);
  const comps = prepare_computations(i, r, [i]);
  const color_ = reflected_color(w, comps, 0);
  expect(color_).toStrictEqual(color(0, 0, 0));
});

test("The refracted color with an opaque surface", () => {
  const w = default_world();
  const shape = w.objects[0];
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = intersections(
    new Intersection(4, shape),
    new Intersection(6, shape)
  );
  const comps = prepare_computations(xs[0], r, xs);
  const c = refracted_color(w, comps, 5);
  expect(c).toStrictEqual(color(0, 0, 0));
});

test("The refracted color at the maximum recursive depth", () => {
  const w = default_world();
  const shape = w.objects[0];
  shape.material.transparency = 1.0;
  shape.material.refractive_index = 1.5;
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = intersections(
    new Intersection(4, shape),
    new Intersection(6, shape)
  );
  const comps = prepare_computations(xs[0], r, xs);
  const c = refracted_color(w, comps, 0);
  expect(c).toStrictEqual(color(0, 0, 0));
});

test("The refracted color under total internal reflection", () => {
  const w = default_world();
  const shape = w.objects[0];
  shape.material.transparency = 1.0;
  shape.material.refractive_index = 1.5;
  const r = new Ray(point(0, 0, -Math.sqrt(2) / 2), vector(0, 1, 0));
  const xs = intersections(
    new Intersection(-Math.sqrt(2) / 2, shape),
    new Intersection(Math.sqrt(2) / 2, shape)
  );
  // note: this time we're inside the sphere, so you need
  // to look at the second intersection, xs[1], not xs[0]
  const comps = prepare_computations(xs[1], r, xs);
  const c = refracted_color(w, comps, 5);
  expect(c).toStrictEqual(color(0, 0, 0));
});

test("The refracted color with a refracted ray", () => {
  const w = default_world();
  const A = w.objects[0];
  A.material.ambient = 1.0;
  A.material.pattern = test_pattern();
  const B = w.objects[1];
  B.material.transparency = 1.0;
  B.material.refractive_index = 1.5;
  const r = new Ray(point(0, 0, 0.1), vector(0, 1, 0));
  const xs = intersections(
    new Intersection(-0.9899, A),
    new Intersection(-0.4899, B),
    new Intersection(0.4899, B),
    new Intersection(0.9899, A)
  );
  const comps = prepare_computations(xs[2], r, xs);
  const c = refracted_color(w, comps, 5);
  expect(c[0]).toBeCloseTo(0, 3);
  expect(c[1]).toBeCloseTo(0.99888, 4);
  expect(c[2]).toBeCloseTo(0.04726, 4);
});

test("shade_hit() with a transparent material", () => {
  const w = default_world();
  const floor = new Plane();
  floor.transform = translation(0, -1, 0);
  floor.material.transparency = 0.5;
  floor.material.refractive_index = 1.5;
  w.objects.push(floor);
  const ball = new Sphere();
  ball.material.color = color(1, 0, 0);
  ball.material.ambient = 0.5;
  ball.transform = translation(0, -3.5, -0.5);
  w.objects.push(ball);
  const r = new Ray(
    point(0, 0, -3),
    vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  const xs = intersections(new Intersection(Math.sqrt(2), floor));
  const comps = prepare_computations(xs[0], r, xs);
  const color_ = shade_hit(w, comps, 5);
  expect(color_[0]).toBeCloseTo(0.93642, 4);
  expect(color_[1]).toBeCloseTo(0.68642, 4);
  expect(color_[2]).toBeCloseTo(0.68642, 4);
});

test("shade_hit() with a reflective, transparent material", () => {
  const w = default_world();
  const r = new Ray(
    point(0, 0, -3),
    vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  const floor = new Plane();
  floor.transform = translation(0, -1, 0);
  floor.material.reflective = 0.5;
  floor.material.transparency = 0.5;
  floor.material.refractive_index = 1.5;
  w.objects.push(floor);
  const ball = new Sphere();
  ball.material.color = color(1, 0, 0);
  ball.material.ambient = 0.5;
  ball.transform = translation(0, -3.5, -0.5);
  w.objects.push(ball);
  const xs = intersections(new Intersection(Math.sqrt(2), floor));
  const comps = prepare_computations(xs[0], r, xs);
  const color_ = shade_hit(w, comps, 5);
  expect(color_[0]).toBeCloseTo(0.93391, 5);
  expect(color_[1]).toBeCloseTo(0.69643, 5);
  expect(color_[2]).toBeCloseTo(0.69243, 5);
});
