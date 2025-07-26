import { Cone } from "../features/cones";
import { Ray } from "../features/rays";
import { normalize, point, vector } from "../features/tuples";

test.each`
  origin             | direction              | t0         | t1
  ${point(0, 0, -5)} | ${vector(0, 0, 1)}     | ${5}       | ${5}
  ${point(0, 0, -5)} | ${vector(1, 1, 1)}     | ${8.66025} | ${8.66025}
  ${point(1, 1, -5)} | ${vector(-0.5, -1, 1)} | ${4.55006} | ${49.44994}
`(
  "Intersecting cone with a ray (origin: $origin, direction: $direction)",
  ({ origin, direction, t0, t1 }) => {
    const shape = new Cone();
    const direction_ = normalize(direction);
    const r = new Ray(origin, direction_);
    const xs = shape.local_intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBeCloseTo(t0, 5);
    expect(xs[1].t).toBeCloseTo(t1, 5);
  }
);

test("Intersecting a cone with a ray parallel to one of its halves", () => {
  const shape = new Cone();
  const direction = normalize(vector(0, 1, 1));
  const r = new Ray(point(0, 0, -1), direction);
  const xs = shape.local_intersect(r);
  expect(xs.length).toBe(1);
  expect(xs[0].t).toBeCloseTo(0.35355, 5);
});

test.each`
  origin                | direction          | count
  ${point(0, 0, -5)}    | ${vector(0, 1, 0)} | ${0}
  ${point(0, 0, -0.25)} | ${vector(0, 1, 1)} | ${2}
  ${point(0, 0, -0.25)} | ${vector(0, 1, 0)} | ${4}
`(
  "Intersecting a cone's end caps (origin: $origin, direction: $direction)",
  ({ origin, direction, count }) => {
    const shape = new Cone();
    shape.minimum = -0.5;
    shape.maximum = 0.5;
    shape.closed = true;
    const direction_ = normalize(direction);
    const r = new Ray(origin, direction_);
    const xs = shape.local_intersect(r);
    expect(xs.length).toBe(count);
  }
);

test.each`
  point               | normal
  ${point(0, 0, 0)}   | ${vector(0, 0, 0)}
  ${point(1, 1, 1)}   | ${vector(1, -Math.sqrt(2), 1)}
  ${point(-1, -1, 0)} | ${vector(-1, 1, 0)}
`(
  "Computing the normal vector on a cone (point: $point, normal: $normal)",
  ({ point, normal }) => {
    const shape = new Cone();
    const n = shape.local_normal_at(point);
    expect(n).toStrictEqual(normal);
  }
);
