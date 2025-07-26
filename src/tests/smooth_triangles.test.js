import {
  intersection_with_uv,
  intersections,
  prepare_computations
} from "../features/intersections";
import { normal_at, Ray } from "../features/rays";
import { SmoothTriangle } from "../features/smooth_triangles";
import { point, vector } from "../features/tuples";

describe("Smooth triangles", () => {
  // these are shared by the tests below
  const p1 = point(0, 1, 0);
  const p2 = point(-1, 0, 0);
  const p3 = point(1, 0, 0);
  const n1 = vector(0, 1, 0);
  const n2 = vector(-1, 0, 0);
  const n3 = vector(1, 0, 0);
  const tri = new SmoothTriangle(p1, p2, p3, n1, n2, n3);

  test("Constructing a smooth triangle", () => {
    expect(tri.p1).toStrictEqual(p1);
    expect(tri.p2).toStrictEqual(p2);
    expect(tri.p3).toStrictEqual(p3);
    expect(tri.n1).toStrictEqual(n1);
    expect(tri.n2).toStrictEqual(n2);
    expect(tri.n3).toStrictEqual(n3);
  });

  test("An intersection with a smooth triangle stores u/v", () => {
    const r = new Ray(point(-0.2, 0.3, -2), vector(0, 0, 1));
    const xs = tri.local_intersect(r);
    expect(xs[0].u).toBeCloseTo(0.45);
    expect(xs[0].v).toBeCloseTo(0.25);
  });

  test("A smooth triangle uses u/v to interpolate the normal", () => {
    const r = new Ray(point(-0.2, 0.3, -2), vector(0, 0, 1));
    const i = intersection_with_uv(1, tri, 0.45, 0.25);
    const n = normal_at(tri, point(0, 0, 0), i);
    expect(n[0]).toBeCloseTo(-0.5547);
    expect(n[1]).toBeCloseTo(0.83205);
    expect(n[2]).toBeCloseTo(0);
  });

  test("Preparing the normal on a smooth triangle", () => {
    const i = intersection_with_uv(1, tri, 0.45, 0.25);
    const r = new Ray(point(-0.2, 0.3, -2), vector(0, 0, 1));
    const xs = intersections(i);
    const comps = prepare_computations(i, r, xs);
    expect(comps.normalv[0]).toBeCloseTo(-0.5547);
    expect(comps.normalv[1]).toBeCloseTo(0.83205);
    expect(comps.normalv[2]).toBeCloseTo(0);
  });
});
