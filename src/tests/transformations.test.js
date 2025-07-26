import {
  identity_matrix,
  inverse,
  matricesEqual,
  matrix4x4,
  matrix_multiply,
  matrix_vector_multiply
} from "../features/matrices";
import { point, vector } from "../features/tuples";
import {
  translation,
  scaling,
  rotation_x,
  rotation_y,
  rotation_z,
  shearing,
  view_transform
} from "../features/transformations";

test("Multiplying by a translation matrix", () => {
  const transform = translation(5, -3, 2);
  const p = point(-3, 4, 5);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(2, 1, 7));
});

test("Multiplying by the inverse of a translation matrix", () => {
  const transform = translation(5, -3, 2);
  const inv = inverse(transform);
  const p = point(-3, 4, 5);
  expect(matrix_vector_multiply(inv, p)).toStrictEqual(point(-8, 7, 3));
});

test("Translation does not affect vectors", () => {
  const transform = translation(5, -3, 2);
  const v = vector(-3, 4, 5);
  expect(matrix_vector_multiply(transform, v)).toStrictEqual(v);
});

test("A scaling matrix applied to a point", () => {
  const transform = scaling(2, 3, 4);
  const p = point(-4, 6, 8);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(-8, 18, 32));
});

test("A scaling matrix applied to a vector", () => {
  const transform = scaling(2, 3, 4);
  const v = vector(-4, 6, 8);
  expect(matrix_vector_multiply(transform, v)).toStrictEqual(
    vector(-8, 18, 32)
  );
});

test("Multiplying by the inverse of a scaling matrix", () => {
  const transform = scaling(2, 3, 4);
  const inv = inverse(transform);
  const v = vector(-4, 6, 8);
  expect(matrix_vector_multiply(inv, v)).toStrictEqual(vector(-2, 2, 2));
});

test("Reflection is scaling by a negative value", () => {
  const transform = scaling(-1, 1, 1);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(-2, 3, 4));
});

test("Rotating a point around the x axis", () => {
  const p = point(0, 1, 0);
  const half_quarter = rotation_x(Math.PI / 4);
  const full_quarter = rotation_x(Math.PI / 2);
  const r = matrix_vector_multiply(half_quarter, p);
  expect(r[0]).toBeCloseTo(0, 5);
  expect(r[1]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  expect(r[2]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  const s = matrix_vector_multiply(full_quarter, p);
  expect(s[0]).toBeCloseTo(0, 5);
  expect(s[1]).toBeCloseTo(0, 5);
  expect(s[2]).toBeCloseTo(1, 5);
});

test("The inverse of an x-rotation rotates in the opposite direction", () => {
  const p = point(0, 1, 0);
  const half_quarter = rotation_x(Math.PI / 4);
  const inv = inverse(half_quarter);
  const r = matrix_vector_multiply(inv, p);
  expect(r[0]).toBeCloseTo(0, 5);
  expect(r[1]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  expect(r[2]).toBeCloseTo(-Math.sqrt(2) / 2, 5);
});

test("Rotating a point around the y axis", () => {
  const p = point(0, 0, 1);
  const half_quarter = rotation_y(Math.PI / 4);
  const full_quarter = rotation_y(Math.PI / 2);
  const r = matrix_vector_multiply(half_quarter, p);
  expect(r[0]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  expect(r[1]).toBeCloseTo(0, 5);
  expect(r[2]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  const s = matrix_vector_multiply(full_quarter, p);
  expect(s[0]).toBeCloseTo(1, 5);
  expect(s[1]).toBeCloseTo(0, 5);
  expect(s[2]).toBeCloseTo(0, 5);
});

test("Rotating a point around the z axis", () => {
  const p = point(0, 1, 0);
  const half_quarter = rotation_z(Math.PI / 4);
  const full_quarter = rotation_z(Math.PI / 2);
  const r = matrix_vector_multiply(half_quarter, p);
  expect(r[0]).toBeCloseTo(-Math.sqrt(2) / 2, 5);
  expect(r[1]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  expect(r[2]).toBeCloseTo(0, 5);
  const s = matrix_vector_multiply(full_quarter, p);
  expect(s[0]).toBeCloseTo(-1, 5);
  expect(s[1]).toBeCloseTo(0, 5);
  expect(s[2]).toBeCloseTo(0, 5);
});

test("A shearing transformation moves x in proportion to y", () => {
  const transform = shearing(1, 0, 0, 0, 0, 0);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(5, 3, 4));
});

test("A shearing transformation moves x in proportion to z", () => {
  const transform = shearing(0, 1, 0, 0, 0, 0);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(6, 3, 4));
});

test("A shearing transformation moves y in proportion to x", () => {
  const transform = shearing(0, 0, 1, 0, 0, 0);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(2, 5, 4));
});

test("A shearing transformation moves y in proportion to z", () => {
  const transform = shearing(0, 0, 0, 1, 0, 0);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(2, 7, 4));
});

test("A shearing transformation moves z in proportion to x", () => {
  const transform = shearing(0, 0, 0, 0, 1, 0);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(2, 3, 6));
});

test("A shearing transformation moves z in proportion to y", () => {
  const transform = shearing(0, 0, 0, 0, 0, 1);
  const p = point(2, 3, 4);
  expect(matrix_vector_multiply(transform, p)).toStrictEqual(point(2, 3, 7));
});

test("Individual transformations are applied in sequence", () => {
  const p = point(1, 0, 1);
  const A = rotation_x(Math.PI / 2);
  const B = scaling(5, 5, 5);
  const C = translation(10, 5, 7);
  // apply rotation first
  const p2 = matrix_vector_multiply(A, p);
  expect(p2[0]).toBeCloseTo(1, 5);
  expect(p2[1]).toBeCloseTo(-1, 5);
  expect(p2[2]).toBeCloseTo(0, 5);
  // then apply scaling
  const p3 = matrix_vector_multiply(B, p2);
  expect(p3[0]).toBeCloseTo(5, 5);
  expect(p3[1]).toBeCloseTo(-5, 5);
  expect(p3[2]).toBeCloseTo(0, 5);
  // then apply translation
  const p4 = matrix_vector_multiply(C, p3);
  expect(p4).toStrictEqual(point(15, 0, 7));
});

test("Chained transformations must be applied in reverse order", () => {
  const p = point(1, 0, 1);
  const A = rotation_x(Math.PI / 2);
  const B = scaling(5, 5, 5);
  const C = translation(10, 5, 7);
  const T = matrix_multiply(C, matrix_multiply(B, A));
  expect(matrix_vector_multiply(T, p)).toStrictEqual(point(15, 0, 7));
});

test("The transformation matrix for the default orientation", () => {
  const from = point(0, 0, 0);
  const to = point(0, 0, -1);
  const up = vector(0, 1, 0);
  const t = view_transform(from, to, up);
  expect(matricesEqual(t, identity_matrix())).toBe(true);
});

test("A view transformation matrix looking in positive z direction", () => {
  const from = point(0, 0, 0);
  const to = point(0, 0, 1);
  const up = vector(0, 1, 0);
  const t = view_transform(from, to, up);
  expect(matricesEqual(t, scaling(-1, 1, -1))).toBe(true);
});

test("A view transformation moves the world", () => {
  const from = point(0, 0, 8);
  const to = point(0, 0, 0);
  const up = vector(0, 1, 0);
  const t = view_transform(from, to, up);
  expect(matricesEqual(t, translation(0, 0, -8))).toBe(true);
});

test("An arbitrary view transformation", () => {
  const from = point(1, 3, 2);
  const to = point(4, -2, 8);
  const up = vector(1, 1, 0);
  const t = view_transform(from, to, up);
  const r = matrix4x4([
    -0.50709, 0.50709, 0.67612, -2.36643, 0.76772, 0.60609, 0.12122, -2.82843,
    -0.35857, 0.59761, -0.71714, 0.0, 0.0, 0.0, 0.0, 1.0
  ]);
  expect(matricesEqual(t, r)).toBe(true);
});
