import _ from "lodash";
import { add_child, group } from "../features/groups";
import { identity_matrix, matricesEqual } from "../features/matrices";
import { set_transform, test_shape } from "../features/shapes";
import { intersect, Ray } from "../features/rays";
import { point, vector } from "../features/tuples";
import { Sphere } from "../features/spheres";
import { scaling, translation } from "../features/transformations";

test("Creating a new group", () => {
  const g = group();
  expect(matricesEqual(g.transform, identity_matrix())).toBe(true);
  expect(g.shapes.length).toBe(0);
});

test("Adding a child to a group", () => {
  const g = group();
  const s = test_shape();
  add_child(g, s);
  expect(g.shapes.length).not.toBe(0);
  expect(g.shapes.includes(s)).toBe(true);
  expect(_.isEqual(s.parent, g)).toBe(true);
});

test("Intersecting an empty group", () => {
  const g = group();
  const r = new Ray(point(0, 0, 0), vector(0, 0, 1));
  const xs = g.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("Intersecting a ray with a nonempty group", () => {
  const g = group();
  const s1 = new Sphere("s1");
  const s2 = new Sphere("s2");
  set_transform(s2, translation(0, 0, -3));
  const s3 = new Sphere("s3");
  set_transform(s3, translation(5, 0, 0));
  add_child(g, s1);
  add_child(g, s2);
  add_child(g, s3);
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = g.local_intersect(r);
  expect(xs.length).toBe(4);
  expect(xs[0].object).toStrictEqual(s2);
  expect(xs[1].object).toStrictEqual(s2);
  expect(xs[2].object).toStrictEqual(s1);
  expect(xs[3].object).toStrictEqual(s1);
});

test("Intersecting a transformed group", () => {
  const g = group();
  set_transform(g, scaling(2, 2, 2));
  const s = new Sphere("s");
  set_transform(s, translation(5, 0, 0));
  add_child(g, s);
  const r = new Ray(point(10, 0, -10), vector(0, 0, 1));
  const xs = intersect(g, r);
  expect(xs.length).toBe(2);
});
