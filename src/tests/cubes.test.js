import { Cube } from "../features/cubes";
import { Ray } from "../features/rays";
import { point, vector } from "../features/tuples";

test.each`
  name        | origin               | direction           | t1    | t2
  ${"+x"}     | ${point(5, 0.5, 0)}  | ${vector(-1, 0, 0)} | ${4}  | ${6}
  ${"-x"}     | ${point(-5, 0.5, 0)} | ${vector(1, 0, 0)}  | ${4}  | ${6}
  ${"+y"}     | ${point(0.5, 5, 0)}  | ${vector(0, -1, 0)} | ${4}  | ${6}
  ${"-y"}     | ${point(0.5, -5, 0)} | ${vector(0, 1, 0)}  | ${4}  | ${6}
  ${"+z"}     | ${point(0.5, 0, 5)}  | ${vector(0, 0, -1)} | ${4}  | ${6}
  ${"-z"}     | ${point(0.5, 0, -5)} | ${vector(0, 0, 1)}  | ${4}  | ${6}
  ${"inside"} | ${point(0, 0.5, 0)}  | ${vector(0, 0, 1)}  | ${-1} | ${1}
`(
  "A ray intersects a cube ($name) at t1 ($t1) and t2 ($t2)",
  ({ origin, direction, t1, t2 }) => {
    const c = new Cube();
    const r = new Ray(origin, direction);
    const xs = c.local_intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(t1);
    expect(xs[1].t).toBe(t2);
  }
);

test.each`
  origin             | direction
  ${point(-2, 0, 0)} | ${vector(0.2673, 0.5345, 0.8018)}
  ${point(0, -2, 0)} | ${vector(0.8018, 0.2673, 0.5345)}
  ${point(0, 0, -2)} | ${vector(0.5345, 0.8018, 0.2673)}
  ${point(2, 0, 2)}  | ${vector(0, 0, -1)}
  ${point(0, 2, 2)}  | ${vector(0, -1, 0)}
  ${point(2, 2, 0)}  | ${vector(-1, 0, 1)}
`(
  "A ray misses a cube (origin: $origin, direction: $direction)",
  ({ origin, direction }) => {
    const c = new Cube();
    const r = new Ray(origin, direction);
    const xs = c.local_intersect(r);
    expect(xs.length).toBe(0);
  }
);

test.each`
  point                   | normal
  ${point(1, 0.5, -0.8)}  | ${vector(1, 0, 0)}
  ${point(-1, -0.2, 0.9)} | ${vector(-1, 0, 0)}
  ${point(-0.4, 1, -0.1)} | ${vector(0, 1, 0)}
  ${point(0.3, -1, -0.7)} | ${vector(0, -1, 0)}
  ${point(-0.6, 0.3, 1)}  | ${vector(0, 0, 1)}
  ${point(0.4, 0.4, -1)}  | ${vector(0, 0, -1)}
  ${point(1, 1, 1)}       | ${vector(1, 0, 0)}
  ${point(-1, -1, -1)}    | ${vector(-1, 0, 0)}
`(
  "The normal on the surface a cube (point: $point, normal: $normal)",
  ({ point, normal }) => {
    const c = new Cube();
    const p = point;
    const normal_ = c.local_normal_at(p);
    expect(normal_).toStrictEqual(normal);
  }
);
