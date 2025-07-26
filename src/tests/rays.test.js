import { Ray, position, transform } from "../features/rays";
import { scaling, translation } from "../features/transformations";
import { point, vector } from "../features/tuples";

test("Creating and querying a ray", () => {
  const origin = point(1, 2, 3);
  const direction = vector(4, 5, 6);
  const r = new Ray(origin, direction);
  expect(r.origin).toStrictEqual(origin);
  expect(r.direction).toStrictEqual(direction);
});

test("Computing a point from a distance", () => {
  const r = new Ray(point(2, 3, 4), vector(1, 0, 0));
  expect(position(r, 0)).toStrictEqual(point(2, 3, 4));
  expect(position(r, 1)).toStrictEqual(point(3, 3, 4));
  expect(position(r, -1)).toStrictEqual(point(1, 3, 4));
  expect(position(r, 2.5)).toStrictEqual(point(4.5, 3, 4));
});

test("Translating a ray", () => {
  const r = new Ray(point(1, 2, 3), vector(0, 1, 0));
  const m = translation(3, 4, 5);
  const r2 = transform(r, m);
  expect(r2.origin).toStrictEqual(point(4, 6, 8));
  expect(r2.direction).toStrictEqual(vector(0, 1, 0));
});

test("Scaling a ray", () => {
  const r = new Ray(point(1, 2, 3), vector(0, 1, 0));
  const m = scaling(2, 3, 4);
  const r2 = transform(r, m);
  expect(r2.origin).toStrictEqual(point(2, 6, 12));
  expect(r2.direction).toStrictEqual(vector(0, 3, 0));
});
