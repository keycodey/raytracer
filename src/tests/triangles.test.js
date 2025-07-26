import { Ray } from "../features/rays";
import { Triangle } from "../features/triangles";
import { point, vector } from "../features/tuples";

test("Constructing triangle", () => {
  const p1 = point(0, 1, 0);
  const p2 = point(-1, 0, 0);
  const p3 = point(1, 0, 0);
  const t = new Triangle(p1, p2, p3);
  expect(t.p1).toStrictEqual(p1);
  expect(t.p2).toStrictEqual(p2);
  expect(t.p3).toStrictEqual(p3);
  expect(t.e1).toStrictEqual(vector(-1, -1, 0));
  expect(t.e2).toStrictEqual(vector(1, -1, 0));
  //expect(t.normal).toStrictEqual(vector(0, 0, -1)); // t.normal = [0, -0, -1, 0]
  expect(t.normal[0]).toBeCloseTo(0, 5);
  expect(t.normal[1]).toBeCloseTo(0, 5);
  expect(t.normal[2]).toBeCloseTo(-1, 5);
  expect(t.normal[3]).toBeCloseTo(0, 5);
});

test("Finding the normal on a triangle", () => {
  const t = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const n1 = t.local_normal_at(point(0, 0.5, 0));
  const n2 = t.local_normal_at(point(-0.5, 0.75, 0));
  const n3 = t.local_normal_at(point(0.5, 0.25, 0));
  expect(n1).toStrictEqual(t.normal);
  expect(n2).toStrictEqual(t.normal);
  expect(n3).toStrictEqual(t.normal);
});

test("Intersecting a ray parallel to the triangle", () => {
  const t = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const r = new Ray(point(0, -1, -2), vector(0, 1, 0));
  const xs = t.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("A ray misses the p1-p3 edge", () => {
  const t = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const r = new Ray(point(1, 1, -2), vector(0, 0, 1));
  const xs = t.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("A ray misses the p1-p2 edge", () => {
  const t = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const r = new Ray(point(-1, 1, -2), vector(0, 0, 1));
  const xs = t.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("A ray misses the p2-p2 edge", () => {
  const t = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const r = new Ray(point(0, -1, -2), vector(0, 0, 1));
  const xs = t.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("A ray strikes a triangle", () => {
  const t = new Triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0));
  const r = new Ray(point(0, 0.5, -2), vector(0, 0, 1));
  const xs = t.local_intersect(r);
  expect(xs.length).toBe(1);
  expect(xs[0].t).toBe(2);
});
