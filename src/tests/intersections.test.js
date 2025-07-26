import {
  hit,
  Intersection,
  intersection_with_uv,
  intersections,
  prepare_computations,
  schlick
} from "../features/intersections";
import { Plane } from "../features/planes";
import { Ray } from "../features/rays";
import { glass_sphere, Sphere } from "../features/spheres";
import { scaling, translation } from "../features/transformations";
import { Triangle } from "../features/triangles";
import { EPSILON, point, vector } from "../features/tuples";

test("An intersection encapsulates t and object", () => {
  const s = new Sphere(1);
  const i = new Intersection(3.5, s);
  expect(i.t).toBe(3.5);
  expect(i.object).toStrictEqual(s);
});

test("Aggregating intersections", () => {
  const s = new Sphere(1);
  const i1 = new Intersection(1, s);
  const i2 = new Intersection(2, s);
  const xs = intersections(i1, i2);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toBe(1);
  expect(xs[1].t).toBe(2);
});

test("The hit, when all intersections have positive t", () => {
  const s = new Sphere(1);
  const i1 = new Intersection(1, s);
  const i2 = new Intersection(2, s);
  const xs = intersections(i1, i2);
  const i = hit(xs);
  expect(i).toStrictEqual(i1);
});

test("The hit, when some intersections have negative t", () => {
  const s = new Sphere(1);
  const i1 = new Intersection(-1, s);
  const i2 = new Intersection(1, s);
  const xs = intersections(i1, i2);
  const i = hit(xs);
  expect(i).toStrictEqual(i2);
});

test("The hit, when all intersections have negative t", () => {
  const s = new Sphere(1);
  const i1 = new Intersection(-2, s);
  const i2 = new Intersection(-1, s);
  const xs = intersections(i1, i2);
  const i = hit(xs);
  expect(i).toStrictEqual(undefined);
});

test("The hit is always the lowest nonnegative intersection", () => {
  const s = new Sphere(1);
  const i1 = new Intersection(5, s);
  const i2 = new Intersection(7, s);
  const i3 = new Intersection(-3, s);
  const i4 = new Intersection(2, s);
  const xs = intersections(i1, i2, i3, i4);
  const i = hit(xs);
  expect(i).toStrictEqual(i4);
});

test("Precomputing the state of an intersection", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const shape = new Sphere(1);
  const i = new Intersection(4, shape);
  const comps = prepare_computations(i, r, [i]);
  expect(comps.t).toStrictEqual(i.t);
  expect(comps.object).toStrictEqual(i.object);
  expect(comps.point).toStrictEqual(point(0, 0, -1));
  // expect(comps.eyev).toStrictEqual(vector(0, 0, -1));
  expect(comps.eyev[0]).toBeCloseTo(0, 5); // JS 0 != -0
  expect(comps.eyev[1]).toBeCloseTo(0, 5);
  expect(comps.eyev[2]).toBeCloseTo(-1, 5);
  expect(comps.eyev[3]).toBeCloseTo(0, 5);
  expect(comps.normalv).toStrictEqual(vector(0, 0, -1));
});

test("The hit, when an intersection occurs on the outside", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const shape = new Sphere("shape");
  const i = new Intersection(4, shape);
  const comps = prepare_computations(i, r, [i]);
  expect(comps.inside).toBe(false);
});

test("The hit, when an intersection occurs on the inside", () => {
  const r = new Ray(point(0, 0, 0), vector(0, 0, 1));
  const shape = new Sphere("shape");
  const i = new Intersection(1, shape);
  const comps = prepare_computations(i, r, [i]);
  expect(comps.point).toStrictEqual(point(0, 0, 1));
  expect(comps.eyev[0]).toBeCloseTo(0, 5); // In JS: 0 != -0
  expect(comps.eyev[1]).toBeCloseTo(0, 5);
  expect(comps.eyev[2]).toBeCloseTo(-1, 5);
  expect(comps.eyev[3]).toBeCloseTo(0, 5);
  expect(comps.inside).toBe(true);
  // normal would have been (0, 0, 1), but is inverted
  // expect(comps.normalv).toStrictEqual(vector(0, 0, -1));
  expect(comps.normalv[0]).toBeCloseTo(0, 5); // JS: 0 != -0
  expect(comps.normalv[1]).toBeCloseTo(0, 5);
  expect(comps.normalv[2]).toBeCloseTo(-1, 5);
  expect(comps.normalv[3]).toBeCloseTo(0, 5);
});

test("The hit should offset the point", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const shape = new Sphere("shape");
  shape.transform = translation(0, 0, 1);
  const i = new Intersection(5, shape);
  const comps = prepare_computations(i, r, [i]);
  expect(comps.over_point[2]).toBeLessThan(-EPSILON / 2);
  expect(comps.point[2]).toBeGreaterThan(comps.over_point[2]);
});

test("Precomputing the reflection vector", () => {
  const shape = new Plane();
  const r = new Ray(
    point(0, 1, -1),
    vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  const i = new Intersection(Math.sqrt(2), shape);
  const comps = prepare_computations(i, r, [i]);
  expect(comps.reflectv).toStrictEqual(
    vector(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
});

test.each`
  index | n1     | n2
  ${0}  | ${1.0} | ${1.5}
  ${1}  | ${1.5} | ${2.0}
  ${2}  | ${2.0} | ${2.5}
  ${3}  | ${2.5} | ${2.5}
  ${4}  | ${2.5} | ${1.5}
  ${5}  | ${1.5} | ${1.0}
`(
  "Finding n1($n1) and n2($n2) at various intersection ($index)",
  ({ index, n1, n2 }) => {
    const A = glass_sphere();
    A.transform = scaling(2, 2, 2);
    A.material.refractive_index = 1.5;
    const B = glass_sphere();
    B.transform = translation(0, 0, 0.25);
    B.material.refractive_index = 2.0;
    const C = glass_sphere();
    C.transform = translation(0, 0, 0.25);
    C.material.refractive_index = 2.5;
    const r = new Ray(point(0, 0, -4), vector(0, 0, 1));
    const xs = intersections(
      new Intersection(2, A),
      new Intersection(2.75, B),
      new Intersection(3.25, C),
      new Intersection(4.75, B),
      new Intersection(5.25, C),
      new Intersection(6, A)
    );
    const comps = prepare_computations(xs[index], r, xs);
    expect(comps.n1).toBe(n1);
    expect(comps.n2).toBe(n2);
  }
);

test("The under point is offset below the surface", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const shape = glass_sphere();
  shape.transform = translation(0, 0, 1);
  const i = new Intersection(5, shape);
  const xs = intersections(i);
  const comps = prepare_computations(i, r, xs);
  expect(comps.under_point[2]).toBeGreaterThan(EPSILON / 2);
  expect(comps.point[2]).toBeLessThan(comps.under_point[2]);
});

test("The Schlick approximation under total internal reflection", () => {
  const shape = glass_sphere();
  const r = new Ray(point(0, 0, -Math.sqrt(2) / 2), vector(0, 1, 0));
  const xs = intersections(
    new Intersection(-Math.sqrt(2) / 2, shape),
    new Intersection(Math.sqrt(2) / 2, shape)
  );
  const comps = prepare_computations(xs[1], r, xs);
  const reflectance = schlick(comps);
  expect(reflectance).toBe(1.0);
});

test("The Schlick approximation with a perpendicular viewing angle", () => {
  const shape = glass_sphere();
  const r = new Ray(point(0, 0, 0), vector(0, 1, 0));
  const xs = intersections(
    new Intersection(-1, shape),
    new Intersection(1, shape)
  );
  const comps = prepare_computations(xs[1], r, xs);
  const reflectance = schlick(comps);
  expect(reflectance).toBeCloseTo(0.04, 5);
});

test("The Schlick approximation with small angle and n2 > n1", () => {
  const shape = glass_sphere();
  const r = new Ray(point(0, 0.99, -2), vector(0, 0, 1));
  const xs = intersections(new Intersection(1.8589, shape));
  const comps = prepare_computations(xs[0], r, xs);
  const reflectance = schlick(comps);
  expect(reflectance).toBeCloseTo(0.48873, 5);
});

test("An intersection can encapsulate 'u' and 'v'", () => {
  const s = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const i = intersection_with_uv(3.5, s, 0.2, 0.4);
  expect(i.u).toBe(0.2);
  expect(i.v).toBe(0.4);
});
