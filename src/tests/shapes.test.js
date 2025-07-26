import { add_child, group } from "../features/groups";
import { Material } from "../features/materials";
import {
  identity_matrix,
  matricesEqual,
  matrix_multiply
} from "../features/matrices";
import { intersect, normal_at, Ray } from "../features/rays";
import {
  normal_to_world,
  set_transform,
  test_shape,
  world_to_object
} from "../features/shapes";
import { Sphere } from "../features/spheres";
import {
  rotation_y,
  rotation_z,
  scaling,
  translation
} from "../features/transformations";
import { point, vector } from "../features/tuples";

test("The default transformation", () => {
  const s = test_shape();
  expect(matricesEqual(s.transform, identity_matrix())).toBe(true);
});

test("Assigning a transformation", () => {
  const s = test_shape();
  set_transform(s, translation(2, 3, 4));
  expect(matricesEqual(s.transform, translation(2, 3, 4))).toBe(true);
});

test("The default material", () => {
  const s = test_shape();
  const m = s.material;
  expect(m).toStrictEqual(new Material());
});

test("Assigning a material", () => {
  const s = test_shape();
  const m = new Material();
  m.ambient = 1;
  s.material = m;
  expect(s.material).toStrictEqual(m);
});

test("Intersecting a scaled shape with a ray", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const s = test_shape();
  set_transform(s, scaling(2, 2, 2));
  const xs = intersect(s, r);
  expect(s.saved_ray.origin).toStrictEqual(point(0, 0, -2.5));
  expect(s.saved_ray.direction).toStrictEqual(vector(0, 0, 0.5));
});

test("Intersecting a translated shape with a ray", () => {
  const r = new Ray(point(0, 0, -5), vector(0, 0, 1));
  const s = test_shape();
  set_transform(s, translation(5, 0, 0));
  const xs = intersect(s, r);
  expect(s.saved_ray.origin).toStrictEqual(point(-5, 0, -5));
  expect(s.saved_ray.direction).toStrictEqual(vector(0, 0, 1));
});

test("Computing the normal on a translated shape", () => {
  const s = test_shape();
  set_transform(s, translation(0, 1, 0));
  const n = normal_at(s, point(0, 1.70711, -0.70711), null);
  expect(n[0]).toBeCloseTo(0, 5);
  expect(n[1]).toBeCloseTo(0.70711, 5);
  expect(n[2]).toBeCloseTo(-0.70711, 5);
  expect(n[3]).toBeCloseTo(0, 5);
});

test("Computing the normal on a transformed shape", () => {
  const s = test_shape();
  const m = matrix_multiply(scaling(1, 0.5, 1), rotation_z(Math.PI / 5));
  set_transform(s, m);
  const n = normal_at(s, point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2), null);
  expect(n[0]).toBeCloseTo(0, 5);
  expect(n[1]).toBeCloseTo(0.97014, 5);
  expect(n[2]).toBeCloseTo(-0.24254, 5);
  expect(n[3]).toBeCloseTo(0, 5);
});

test("A shape has a parent attribute", () => {
  const s = test_shape();
  expect(s.parent).toBe(undefined);
});

test("Converting a point from world to object space", () => {
  const g1 = group();
  set_transform(g1, rotation_y(Math.PI / 2));
  const g2 = group();
  set_transform(g2, scaling(2, 2, 2));
  add_child(g1, g2);
  const s = new Sphere("s");
  set_transform(s, translation(5, 0, 0));
  add_child(g2, s);
  const p = world_to_object(s, point(-2, 0, -10));
  // expect(p).toStrictEqual(point(0, 0, -1));
  expect(p[0]).toBeCloseTo(0, 5);
  expect(p[1]).toBeCloseTo(0, 5);
  expect(p[2]).toBeCloseTo(-1, 5);
  expect(p[3]).toBeCloseTo(1, 5);
});

test("Converting a normal from object to world space", () => {
  const g1 = group();
  set_transform(g1, rotation_y(Math.PI / 2));
  const g2 = group();
  set_transform(g2, scaling(1, 2, 3));
  add_child(g1, g2);
  const s = new Sphere("s");
  set_transform(s, translation(5, 0, 0));
  add_child(g2, s);
  const n = normal_to_world(
    s,
    vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n[0]).toBeCloseTo(0.2857, 4);
  expect(n[1]).toBeCloseTo(0.4286, 4);
  expect(n[2]).toBeCloseTo(-0.8571, 4);
  expect(n[3]).toBeCloseTo(0, 4);
});

test("Finding the normal on a child object", () => {
  const g1 = group();
  set_transform(g1, rotation_y(Math.PI / 2));
  const g2 = group();
  set_transform(g2, scaling(1, 2, 3));
  add_child(g1, g2);
  const s = new Sphere("s");
  set_transform(s, translation(5, 0, 0));
  add_child(g2, s);
  const n = normal_at(s, point(1.7321, 1.1547, -5.5774), null);
  expect(n[0]).toBeCloseTo(0.2857, 4);
  expect(n[1]).toBeCloseTo(0.4286, 3);
  expect(n[2]).toBeCloseTo(-0.8571, 3);
  expect(n[3]).toBeCloseTo(0, 4);
});
