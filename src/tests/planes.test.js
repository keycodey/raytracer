import { Plane } from "../features/planes";
import { Ray } from "../features/rays";
import { point, vector } from "../features/tuples";

test("The normal of a plane is constant everywhere", () => {
  const p = new Plane();
  const n1 = p.local_normal_at(point(0, 0, 0));
  const n2 = p.local_normal_at(point(10, 0, -10));
  const n3 = p.local_normal_at(point(-5, 0, 150));
  expect(n1).toStrictEqual(vector(0, 1, 0));
  expect(n2).toStrictEqual(vector(0, 1, 0));
  expect(n3).toStrictEqual(vector(0, 1, 0));
});

test("Intersect with a ray parallel to the plane", () => {
  const p = new Plane();
  const r = new Ray(point(0, 10, 0), vector(0, 0, 1));
  const xs = p.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("Intersect with a coplanar ray", () => {
  const p = new Plane();
  const r = new Ray(point(0, 0, 0), vector(0, 0, 1));
  const xs = p.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("A ray intersecting a plane from above", () => {
  const p = new Plane();
  const r = new Ray(point(0, 1, 0), vector(0, -1, 0));
  const xs = p.local_intersect(r);
  expect(xs.length).toBe(1);
  expect(xs[0].t).toBe(1);
  expect(xs[0].object).toBe(p);
});

test("A ray intersecting a plane from below", () => {
  const p = new Plane();
  const r = new Ray(point(0, -1, 0), vector(0, 1, 0));
  const xs = p.local_intersect(r);
  expect(xs.length).toBe(1);
  expect(xs[0].t).toBe(1);
  expect(xs[0].object).toBe(p);
});
