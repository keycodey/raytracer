import { Cylinder } from "../features/cylinders";
import { Ray } from "../features/rays";
import { normalize, point, vector } from "../features/tuples";

test.each`
  origin             | direction
  ${point(1, 0, 0)}  | ${vector(0, 1, 0)}
  ${point(0, 0, 0)}  | ${vector(0, 1, 0)}
  ${point(0, 0, -5)} | ${vector(1, 1, 1)}
`(
  "A ray misses a cylinder (origin: $origin, direction: $direction)",
  ({ origin, direction }) => {
    const cyl = new Cylinder();
    const direction_ = normalize(direction);
    const r = new Ray(origin, direction_);
    const xs = cyl.local_intersect(r);
    expect(xs.length).toBe(0);
  }
);

test.each`
  origin               | direction            | t0         | t1
  ${point(1, 0, -5)}   | ${vector(0, 0, 1)}   | ${5}       | ${5}
  ${point(0, 0, -5)}   | ${vector(0, 0, 1)}   | ${4}       | ${6}
  ${point(0.5, 0, -5)} | ${vector(0.1, 1, 1)} | ${6.80798} | ${7.08872}
`(
  "A ray strikes a cylinder (origin: $origin, direction: $direction)",
  ({ origin, direction, t0, t1 }) => {
    const cyl = new Cylinder();
    const direction_ = normalize(direction);
    const r = new Ray(origin, direction_);
    const xs = cyl.local_intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBeCloseTo(t0, 5);
    expect(xs[1].t).toBeCloseTo(t1, 5);
  }
);

test.each`
  point              | normal
  ${point(1, 0, 0)}  | ${vector(1, 0, 0)}
  ${point(0, 5, -1)} | ${vector(0, 0, -1)}
  ${point(0, -2, 1)} | ${vector(0, 0, 1)}
  ${point(-1, 1, 0)} | ${vector(-1, 0, 0)}
`(
  "Normal vector on a cylinder (origin: $origin, normal: $normal)",
  ({ point, normal }) => {
    const cyl = new Cylinder();
    const n = cyl.local_normal_at(point);
    expect(n).toStrictEqual(normal);
  }
);

test("The default minimum and maximum for a cylinder", () => {
  const cyl = new Cylinder();
  expect(cyl.minimum).toBe(-Infinity);
  expect(cyl.maximum).toBe(Infinity);
});

test.each`
  point                | direction            | count
  ${point(0, 1.5, 0)}  | ${vector(0.1, 1, 0)} | ${0}
  ${point(0, 3, -5)}   | ${vector(0, 0, 1)}   | ${0}
  ${point(0, 0, -5)}   | ${vector(0, 0, 1)}   | ${0}
  ${point(0, 2, -5)}   | ${vector(0, 0, 1)}   | ${0}
  ${point(0, 1, -5)}   | ${vector(0, 0, 1)}   | ${0}
  ${point(0, 1.5, -2)} | ${vector(0, 0, 1)}   | ${2}
`(
  "Intersecting a constrained cylinder (point: $point, direction: $direction)",
  ({ point, direction, count }) => {
    const cyl = new Cylinder();
    cyl.minimum = 1;
    cyl.maximum = 2;
    const direction_ = normalize(direction);
    const r = new Ray(point, direction_);
    const xs = cyl.local_intersect(r);
    expect(xs.length).toBe(count);
  }
);

test("The default closed value for a cylinder", () => {
  const cyl = new Cylinder();
  expect(cyl.closed).toBe(false);
});

test.each`
  point               | direction           | count
  ${point(0, 3, 0)}   | ${vector(0, -1, 0)} | ${2}
  ${point(0, 3, -2)}  | ${vector(0, -1, 2)} | ${2}
  ${point(0, 4, -2)}  | ${vector(0, -1, 1)} | ${2}
  ${point(0, 0, -2)}  | ${vector(0, 1, 2)}  | ${2}
  ${point(0, -1, -2)} | ${vector(0, 1, 1)}  | ${2}
`(
  "Intersecting the caps of a closed cylinder (point: $point, direction: $direction)",
  ({ point, direction, count }) => {
    const cyl = new Cylinder();
    cyl.minimum = 1;
    cyl.maximum = 2;
    cyl.closed = true;
    const direction_ = normalize(direction);
    const r = new Ray(point, direction_);
    const xs = cyl.local_intersect(r);
    expect(xs.length).toBe(count);
  }
);

test.each`
  point               | normal
  ${point(0, 1, 0)}   | ${vector(0, -1, 0)}
  ${point(0.5, 1, 0)} | ${vector(0, -1, 0)}
  ${point(0, 1, 0.5)} | ${vector(0, -1, 0)}
  ${point(0, 2, 0)}   | ${vector(0, 1, 0)}
  ${point(0.5, 2, 0)} | ${vector(0, 1, 0)}
  ${point(0, 2, 0.5)} | ${vector(0, 1, 0)}
`(
  "The normal vector on a cylinder's end caps (point: $point, normal: $normal)",
  ({ point, normal }) => {
    const cyl = new Cylinder();
    cyl.minimum = 1;
    cyl.maximum = 2;
    cyl.closed = true;
    const n = cyl.local_normal_at(point);
    expect(n).toStrictEqual(normal);
  }
);
