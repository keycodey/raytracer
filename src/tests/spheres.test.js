import { Material } from "../features/materials";
import {
  identity_matrix,
  matricesEqual,
  matrix_multiply
} from "../features/matrices";
import { intersect, normal_at, Ray } from "../features/rays";
import { set_transform, Shape } from "../features/shapes";
import { glass_sphere, Sphere } from "../features/spheres";
import { rotation_z, scaling, translation } from "../features/transformations";
import { normalize, point, vector } from "../features/tuples";

test("A ray intersects a sphere at two points", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const s = new Sphere("s");
  const xs = intersect(s, r);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toBe(4.0);
  expect(xs[1].t).toBe(6.0);
});

test("A ray intersects a sphere at a tangent", () => {
  const r = new Ray(point(0, 1, -5), vector(0, 0, 1));
  const s = new Sphere("s");
  const xs = intersect(s, r);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toBe(5.0);
  expect(xs[1].t).toBe(5.0);
});

test("A ray misses a sphere", () => {
  const r = new Ray(point(0, 2, -5), vector(0, 0, 1));
  const s = new Sphere("s");
  const xs = intersect(s, r);
  expect(xs.length).toBe(0);
});

test("A ray originates inside a sphere", () => {
  const r = new Ray(point(0, 0, 0), vector(0, 0, 1));
  const s = new Sphere("s");
  const xs = intersect(s, r);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toBe(-1.0);
  expect(xs[1].t).toBe(1.0);
});

test("A sphere is behind a ray", () => {
  const r = new Ray(point(0, 0, 5), vector(0, 0, 1));
  const s = new Sphere("s");
  const xs = intersect(s, r);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toBe(-6.0);
  expect(xs[1].t).toBe(-4.0);
});

test("Intersect sets the object on the intersection", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const s = new Sphere("s");
  const xs = intersect(s, r);
  expect(xs.length).toBe(2);
  expect(xs[0].object).toStrictEqual(s);
  expect(xs[1].object).toStrictEqual(s);
});

test("A sphere's default transformation", () => {
  const s = new Sphere("s");
  expect(matricesEqual(s.transform, identity_matrix())).toBe(true);
});

test("Changing a sphere's transformation", () => {
  const s = new Sphere("s");
  const t = translation(2, 3, 4);
  set_transform(s, t);
  expect(matricesEqual(s.transform, t)).toBe(true);
});

test("Intersecting a scaled sphere with a ray", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const s = new Sphere("s");
  set_transform(s, scaling(2, 2, 2));
  const xs = intersect(s, r);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toStrictEqual(3);
  expect(xs[1].t).toStrictEqual(7);
});

test("Intersecting a translated sphere with a ray", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const s = new Sphere("s");
  set_transform(s, translation(5, 0, 0));
  const xs = intersect(s, r);
  expect(xs.length).toBe(0);
});

test("The normal on a sphere at a point on the x axis", () => {
  const s = new Sphere("s");
  const n = s.local_normal_at(point(1, 0, 0));
  expect(n).toStrictEqual(vector(1, 0, 0));
});

test("The normal on a sphere at a point on the y axis", () => {
  const s = new Sphere("s");
  const n = s.local_normal_at(point(0, 1, 0));
  expect(n).toStrictEqual(vector(0, 1, 0));
});

test("The normal on a sphere at a point on the z axis", () => {
  const s = new Sphere("s");
  const n = s.local_normal_at(point(0, 0, 1));
  expect(n).toStrictEqual(vector(0, 0, 1));
});

test("The normal on a sphere at a nonaxial point", () => {
  const s = new Sphere("s");
  const n = s.local_normal_at(
    point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n).toStrictEqual(
    vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
});

test("The normal is a normalized vector", () => {
  const s = new Sphere("s");
  const n = s.local_normal_at(
    point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n).toStrictEqual(normalize(n));
});

test("Computing the normal on a translated sphere", () => {
  const s = new Sphere("s");
  set_transform(s, translation(0, 1, 0));
  // translation => local_normal_at gives an incorrect answer
  const n = normal_at(s, point(0, 1.70711, -0.70711), null);
  expect(n[0]).toBeCloseTo(0, 5);
  expect(n[1]).toBeCloseTo(0.70711, 5);
  expect(n[2]).toBeCloseTo(-0.70711, 5);
});

test("Computing the normal on transformed sphere", () => {
  const s = new Sphere("s");
  const m = matrix_multiply(scaling(1, 0.5, 1), rotation_z(Math.PI / 5));
  set_transform(s, m);
  // scaling, rotation => local_normal_at gives an incorrect answer
  const n = normal_at(s, point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2), null);
  expect(n[0]).toBeCloseTo(0, 5);
  expect(n[1]).toBeCloseTo(0.97014, 5);
  expect(n[2]).toBeCloseTo(-0.24254, 5);
});

test("A sphere has a default material", () => {
  const s = new Sphere("s");
  const m = s.material;
  expect(m).toStrictEqual(new Material());
});

test("A sphere may be assigned a material", () => {
  const s = new Sphere("s");
  const m = new Material();
  m.ambient = 1;
  s.material = m;
  expect(s.material).toStrictEqual(m);
});

test("A Sphere is a Shape", () => {
  const s = new Sphere("sphere");
  expect(s instanceof Shape).toBe(true);
});

test("A helper for producing a sphere with a glassy material", () => {
  const s = glass_sphere();
  expect(matricesEqual(s.transform, identity_matrix())).toBe(true);
  expect(s.material.transparency).toBe(1.0);
  expect(s.material.refractive_index).toBe(1.5);
});
