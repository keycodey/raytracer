import {
  tuple,
  point,
  vector,
  add,
  sub,
  negate,
  scale,
  magnitude,
  normalize,
  dot,
  cross,
  color,
  addColors,
  subColors,
  multiplyColorByScalar,
  hadamard_product,
  reflect
} from "../features/tuples";

test("A tuple with w=1.0 is a point", () => {
  const a = tuple(4.3, -4.2, 3.1, 1.0);
  expect(a[0]).toBe(4.3);
  expect(a[1]).toBe(-4.2);
  expect(a[2]).toBe(3.1);
  expect(a[3]).toBe(1.0);
});

test("A tuple with w=0.0 is a vector", () => {
  const a = tuple(4.3, -4.2, 3.1, 0.0);
  expect(a[0]).toBe(4.3);
  expect(a[1]).toBe(-4.2);
  expect(a[2]).toBe(3.1);
  expect(a[3]).toBe(0.0);
});

test("point() creates tuples with w=1", () => {
  const p = point(4, -4, 3);
  expect(p).toStrictEqual(tuple(4, -4, 3, 1));
});

test("vector() creates tuples with w=0", () => {
  const v = vector(4, -4, 3);
  expect(v).toStrictEqual(tuple(4, -4, 3, 0));
});

test("Adding two tuples", () => {
  const a1 = tuple(3, -2, 5, 1);
  const a2 = tuple(-2, 3, 1, 0);
  expect(add(a1, a2)).toStrictEqual(tuple(1, 1, 6, 1));
});

test("Subtracting two points", () => {
  const p1 = point(3, 2, 1);
  const p2 = point(5, 6, 7);
  expect(sub(p1, p2)).toStrictEqual(tuple(-2, -4, -6, 0));
});

test("Subtracting a vector from a point", () => {
  const p = point(3, 2, 1);
  const v = vector(5, 6, 7);
  expect(sub(p, v)).toStrictEqual(point(-2, -4, -6));
});

test("Subtracting two vectors", () => {
  const v1 = vector(3, 2, 1);
  const v2 = vector(5, 6, 7);
  expect(sub(v1, v2)).toStrictEqual(vector(-2, -4, -6));
});

test("Subtracting a vector from the zero vector", () => {
  const zero = vector(0, 0, 0);
  const v = vector(1, -2, 3);
  expect(sub(zero, v)).toStrictEqual(vector(-1, 2, -3));
});

test("Negating a tuple", () => {
  const a = tuple(1, -2, 3, -4);
  expect(negate(a)).toStrictEqual(tuple(-1, 2, -3, 4));
});

test("Multiplying a tuple by a scalar", () => {
  const a = tuple(1, -2, 3, -4);
  expect(scale(3.5, a)).toStrictEqual(tuple(3.5, -7, 10.5, -14));
});

test("Multiplying a tuple by a fraction", () => {
  const a = tuple(1, -2, 3, -4);
  expect(scale(0.5, a)).toStrictEqual(tuple(0.5, -1, 1.5, -2));
});

test("Computing the magnitude of vector(1, 0, 0)", () => {
  const v = vector(1, 0, 0);
  expect(magnitude(v)).toBe(1);
});

test("Computing the magnitude of vector(0, 1, 0)", () => {
  const v = vector(0, 1, 0);
  expect(magnitude(v)).toBe(1);
});

test("Computing the magnitude of vector(0, 0, 1)", () => {
  const v = vector(0, 0, 1);
  expect(magnitude(v)).toBe(1);
});

test("Computing the magnitude of vector(1, 2, 3)", () => {
  const v = vector(1, 2, 3);
  expect(magnitude(v)).toBe(Math.sqrt(14));
});

test("Computing the magnitude of vector(-1, -2, -3)", () => {
  const v = vector(-1, -2, -3);
  expect(magnitude(v)).toBe(Math.sqrt(14));
});

test("Normalizing vector(4, 0, 0) gives vector(1, 0, 0)", () => {
  const v = vector(4, 0, 0);
  expect(normalize(v)).toStrictEqual(vector(1, 0, 0));
});

test("Normalizing vector(1, 2, 3)", () => {
  const v = vector(1, 2, 3);
  const n = normalize(v);
  expect(n[0]).toBeCloseTo(0.26726, 5); // 1/sqrt(14)
  expect(n[1]).toBeCloseTo(0.53452, 5);
  expect(n[2]).toBeCloseTo(0.80178, 5);
});

test("The magnitude of a normalized vector", () => {
  const v = vector(1, 2, 3);
  const norm = normalize(v);
  expect(magnitude(norm)).toBe(1);
});

test("The magnitude of a normalized vector (alternative test)", () => {
  const v = vector(1, 2, 3);
  const norm = normalize(v);
  expect(magnitude(norm)).toBeCloseTo(1.0, 5);
});

test("The dot product of two tuples", () => {
  const a = vector(1, 2, 3);
  const b = vector(2, 3, 4);
  expect(dot(a, b)).toBe(20);
});

test("The cross product of two vectors", () => {
  const a = vector(1, 2, 3);
  const b = vector(2, 3, 4);
  expect(cross(a, b)).toStrictEqual(vector(-1, 2, -1));
  expect(cross(b, a)).toStrictEqual(vector(1, -2, 1));
});

test("Colors are (red, green, blue) tuples", () => {
  const c = color(-0.5, 0.4, 1.7);
  expect(c[0]).toBe(-0.5);
  expect(c[1]).toBe(0.4);
  expect(c[2]).toBe(1.7);
});

test("Adding colors", () => {
  const c1 = color(0.9, 0.6, 0.75);
  const c2 = color(0.7, 0.1, 0.25);
  expect(addColors(c1, c2)).toStrictEqual(color(1.6, 0.7, 1.0));
});

test("Subtracting colors", () => {
  const c1 = color(0.9, 0.6, 0.75);
  const c2 = color(0.7, 0.1, 0.25);
  const r = subColors(c1, c2);
  // expect(r).toStrictEqual(color(0.2, 0.5, 0.5)); // JS: 0.20000000000000007
  expect(r[0]).toBeCloseTo(0.2, 5);
  expect(r[1]).toBeCloseTo(0.5, 5);
  expect(r[2]).toBeCloseTo(0.5, 5);
});

test("Multiplying a color by a scalar", () => {
  const c = color(0.2, 0.3, 0.4);
  expect(multiplyColorByScalar(2, c)).toStrictEqual(color(0.4, 0.6, 0.8));
});

test("Multiplying colors", () => {
  const c1 = color(1, 0.2, 0.4);
  const c2 = color(0.9, 1, 0.1);
  const r = hadamard_product(c1, c2);
  expect(r[0]).toBeCloseTo(0.9, 5);
  expect(r[1]).toBeCloseTo(0.2, 5);
  expect(r[2]).toBeCloseTo(0.04, 5);
});

test("Reflecting a vector approaching at 45 degrees", () => {
  const v = vector(1, -1, 0);
  const n = vector(0, 1, 0);
  const r = reflect(v, n);
  expect(r).toStrictEqual(vector(1, 1, 0));
});

test("Reflecting a vector off a slanted surface", () => {
  const v = vector(0, -1, 0);
  const n = vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
  const r = reflect(v, n);
  //expect(r).toStrictEqual(vector(1, 0, 0));
  expect(r[0]).toBeCloseTo(1, 5);
  expect(r[1]).toBeCloseTo(0, 5);
  expect(r[2]).toBeCloseTo(0, 5);
});
