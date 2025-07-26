import _ from "lodash";
import {
  CSG,
  filter_intersections,
  intersection_allowed
} from "../features/csg";
import { Cube } from "../features/cubes";
import { Intersection, intersections } from "../features/intersections";
import { Sphere } from "../features/spheres";
import { Ray } from "../features/rays";
import { point, vector } from "../features/tuples";
import { set_transform } from "../features/shapes";
import { translation } from "../features/transformations";
import { add_child, group } from "../features/groups";

test("CSG is created with an operation and two shapes", () => {
  const s1 = new Sphere("s1");
  const s2 = new Cube();
  const c = new CSG("union", s1, s2);
  expect(c.operation).toBe("union");
  expect(c.left).toStrictEqual(s1);
  expect(c.right).toStrictEqual(s2);
  expect(s1.parent).toStrictEqual(c);
  expect(s2.parent).toStrictEqual(c);
});

test.each`
  op                | lhit     | inl      | inr      | result
  ${"union"}        | ${true}  | ${true}  | ${true}  | ${false}
  ${"union"}        | ${true}  | ${true}  | ${false} | ${true}
  ${"union"}        | ${true}  | ${false} | ${true}  | ${false}
  ${"union"}        | ${true}  | ${false} | ${false} | ${true}
  ${"union"}        | ${false} | ${true}  | ${true}  | ${false}
  ${"union"}        | ${false} | ${true}  | ${false} | ${false}
  ${"union"}        | ${false} | ${false} | ${true}  | ${true}
  ${"union"}        | ${false} | ${false} | ${false} | ${true}
  ${"intersection"} | ${true}  | ${true}  | ${true}  | ${true}
  ${"intersection"} | ${true}  | ${true}  | ${false} | ${false}
  ${"intersection"} | ${true}  | ${false} | ${true}  | ${true}
  ${"intersection"} | ${true}  | ${false} | ${false} | ${false}
  ${"intersection"} | ${false} | ${true}  | ${true}  | ${true}
  ${"intersection"} | ${false} | ${true}  | ${false} | ${true}
  ${"intersection"} | ${false} | ${false} | ${true}  | ${false}
  ${"intersection"} | ${false} | ${false} | ${false} | ${false}
  ${"difference"}   | ${true}  | ${true}  | ${true}  | ${false}
  ${"difference"}   | ${true}  | ${true}  | ${false} | ${true}
  ${"difference"}   | ${true}  | ${false} | ${true}  | ${false}
  ${"difference"}   | ${true}  | ${false} | ${false} | ${true}
  ${"difference"}   | ${false} | ${true}  | ${true}  | ${true}
  ${"difference"}   | ${false} | ${true}  | ${false} | ${true}
  ${"difference"}   | ${false} | ${false} | ${true}  | ${false}
  ${"difference"}   | ${false} | ${false} | ${false} | ${false}
`(
  "Evaluating the rule a CSG operation (op: $op, lhit: $lhit, inl: $inl, inr: $inr)",
  ({ op, lhit, inl, inr, result }) => {
    const result_ = intersection_allowed(op, lhit, inl, inr);
    expect(result_).toBe(result);
  }
);

test.each`
  op                | x0   | x1
  ${"union"}        | ${0} | ${3}
  ${"intersection"} | ${1} | ${2}
  ${"difference"}   | ${0} | ${1}
`(
  "Filtering a list of operations (op: $op, xo: $xo, x1: $x1)",
  ({ op, x0, x1 }) => {
    const s1 = new Sphere("s1");
    const s2 = new Cube();
    const c = new CSG(op, s1, s2);
    const xs = intersections(
      new Intersection(1, s1),
      new Intersection(2, s2),
      new Intersection(3, s1),
      new Intersection(4, s2)
    );
    const result = filter_intersections(c, xs);
    expect(result.length).toBe(2);
    expect(_.isEqual(result[0], xs[x0])).toBe(true);
    expect(_.isEqual(result[1], xs[x1])).toBe(true);
  }
);

test("A ray misses a CSG object", () => {
  const c = new CSG("union", new Sphere("s1"), new Cube());
  const r = new Ray(point(0, 2, -5), vector(0, 0, 1));
  const xs = c.local_intersect(r);
  expect(xs.length).toBe(0);
});

test("A ray hits a CSG object", () => {
  const s1 = new Sphere("s1");
  const s2 = new Sphere("s2");
  set_transform(s2, translation(0, 0, 0.5));
  const c = new CSG("union", s1, s2);
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = c.local_intersect(r);
  expect(xs.length).toBe(2);
  expect(xs[0].t).toBe(4);
  expect(_.isEqual(xs[0].object, s1)).toBe(true);
  expect(xs[1].t).toBe(6.5);
  expect(_.isEqual(xs[1].object, s2)).toBe(true);
});

// npm test -- -t "Recursive search: a case with a group" --verbose=false
test("Recursive search: a case with a group", () => {
  const g = group();
  const s1 = new Sphere("s1");
  add_child(g, s1);
  const s2 = new Sphere("s2");
  set_transform(s2, translation(0, 0, 1));
  const c = new CSG("union", g, s2);
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = c.local_intersect(r);
  expect(xs.length).toBe(2);
});

// npm test -- -t "Recursive search: a case with a CSG object" --verbose=false
test("Recursive search: a case with a CSG object", () => {
  const s1 = new Sphere("s1");
  const s2 = new Sphere("s2");
  set_transform(s2, translation(0, 0, 1));
  const c_inner = new CSG("union", s1, s2);
  const s3 = new Sphere("s3");
  set_transform(s3, translation(0, 0, 4));
  const c = new CSG("union", c_inner, s3);
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = c.local_intersect(r);
  expect(xs.length).toBe(4);
});
