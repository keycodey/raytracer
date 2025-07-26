import {
  matrix2x2,
  matrix3x3,
  matrix4x4,
  matricesEqual,
  matrix_multiply,
  matrix_vector_multiply,
  identity_matrix,
  transpose,
  determinant,
  submatrix,
  minor,
  cofactor,
  inverse
} from "../features/matrices";
import { tuple } from "../features/tuples";

test("Constructing and inspecting a 4x4 matrix", () => {
  const M = matrix4x4([
    1, 2, 3, 4, 5.5, 6.5, 7.5, 8.5, 9, 10, 11, 12, 13.5, 14.5, 15.5, 16.5
  ]);
  expect(M[0][0]).toBe(1);
  expect(M[0][3]).toBe(4);
  expect(M[1][0]).toBe(5.5);
  expect(M[1][2]).toBe(7.5);
  expect(M[2][2]).toBe(11);
  expect(M[3][0]).toBe(13.5);
  expect(M[3][2]).toBe(15.5);
});

test("A 2x2 matrix ought to be representable", () => {
  const M = matrix2x2([-3, 5, 1, -2]);
  expect(M[0][0]).toBe(-3);
  expect(M[0][1]).toBe(5);
  expect(M[1][0]).toBe(1);
  expect(M[1][1]).toBe(-2);
});

test("A 3x3 matrix ought to be representable", () => {
  const M = matrix3x3([-3, 5, 0, 1, -2, -7, 0, 1, 1]);
  expect(M[0][0]).toBe(-3);
  expect(M[1][1]).toBe(-2);
  expect(M[2][2]).toBe(1);
});

test("Matrix equality with identical matrices", () => {
  const A = matrix4x4([1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  const B = matrix4x4([1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  expect(matricesEqual(A, B)).toBe(true);
});

test("Matrix equality with different matrices", () => {
  const A = matrix4x4([1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  const B = matrix4x4([2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  expect(matricesEqual(A, B)).toBe(false);
});

test("Multiplying two matrices", () => {
  const A = matrix4x4([1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  const B = matrix4x4([-2, 1, 2, 3, 3, 2, 1, -1, 4, 3, 6, 5, 1, 2, 7, 8]);
  const M = matrix_multiply(A, B);
  const N = matrix4x4([
    20, 22, 50, 48, 44, 54, 114, 108, 40, 58, 110, 102, 16, 26, 46, 42
  ]);
  expect(matricesEqual(M, N)).toBe(true);
});

test("A matrix multiplied by a tuple", () => {
  const A = matrix4x4([1, 2, 3, 4, 2, 4, 4, 2, 8, 6, 4, 1, 0, 0, 0, 1]);
  const b = [1, 2, 3, 1];
  const x = matrix_vector_multiply(A, b);
  expect(x).toStrictEqual([18, 24, 33, 1]);
});

test("Multiplying a matrix by the identity matrix", () => {
  const A = matrix4x4([0, 1, 2, 4, 1, 2, 4, 8, 2, 4, 8, 16, 4, 8, 16, 32]);
  const I = identity_matrix();
  const M = matrix_multiply(A, I);
  expect(matricesEqual(A, M)).toBe(true);
});

test("Multiplying the identity matrix by a tuple", () => {
  const a = tuple(1, 2, 3, 4);
  const I = identity_matrix();
  const x = matrix_vector_multiply(I, a);
  expect(x).toStrictEqual(a);
});

test("Transposing a matrix", () => {
  const A = matrix4x4([0, 9, 3, 0, 9, 8, 0, 8, 1, 8, 5, 3, 0, 0, 5, 8]);
  const AT = transpose(A);
  const T = matrix4x4([0, 9, 1, 0, 9, 8, 8, 0, 3, 0, 5, 5, 0, 8, 3, 8]);
  expect(matricesEqual(AT, T)).toBe(true);
});

test("Transposing the identity matrix", () => {
  const I = identity_matrix();
  const IT = transpose(I);
  expect(matricesEqual(I, IT)).toBe(true);
});

test("Calculating the determinant of a 2x2 matrix", () => {
  const A = matrix2x2([1, 5, -3, 2]);
  expect(determinant(A)).toBe(17);
});

test("A submatrix of a 3x3 is a 2x2 matrix", () => {
  const A = matrix3x3([1, 5, 0, -3, 2, 7, 0, 6, -3]);
  const Asub = submatrix(A, 0, 2);
  const S = matrix2x2([-3, 2, 0, 6]);
  expect(matricesEqual(Asub, S)).toBe(true);
});

test("A submatrix of a 4x4 is a 3x3 matrix", () => {
  const A = matrix4x4([-6, 1, 1, 6, -8, 5, 8, 6, -1, 0, 8, 2, -7, 1, -1, 1]);
  const Asub = submatrix(A, 2, 1);
  const S = matrix3x3([-6, 1, 6, -8, 8, 6, -7, -1, 1]);
  expect(matricesEqual(Asub, S)).toBe(true);
});

test("Calculating a minor of a 3x3 matrix", () => {
  const A = matrix3x3([3, 5, 0, 2, -1, -7, 6, -1, 5]);
  const B = submatrix(A, 1, 0);
  expect(determinant(B)).toBe(25);
  expect(minor(A, 1, 0)).toBe(25);
});

test("Calculating a cofactor of a 3x3 matrix", () => {
  const A = matrix3x3([3, 5, 0, 2, -1, -7, 6, -1, 5]);
  expect(minor(A, 0, 0)).toBe(-12);
  expect(cofactor(A, 0, 0)).toBe(-12);
  expect(minor(A, 1, 0)).toBe(25);
  expect(cofactor(A, 1, 0)).toBe(-25);
});

test("Calculating the determinant of a 3x3 matrix", () => {
  const A = matrix3x3([1, 2, 6, -5, 8, -4, 2, 6, 4]);
  expect(cofactor(A, 0, 0)).toBe(56);
  expect(cofactor(A, 0, 1)).toBe(12);
  expect(cofactor(A, 0, 2)).toBe(-46);
  expect(determinant(A)).toBe(-196);
});

test("Calculating the determinant of a 4x4 matrix", () => {
  const A = matrix4x4([-2, -8, 3, 5, -3, 1, 7, 3, 1, 2, -9, 6, -6, 7, 7, -9]);
  expect(cofactor(A, 0, 0)).toBe(690);
  expect(cofactor(A, 0, 1)).toBe(447);
  expect(cofactor(A, 0, 2)).toBe(210);
  expect(cofactor(A, 0, 3)).toBe(51);
  expect(determinant(A)).toBe(-4071);
});

test("Testing an invertible matrix for invertibility", () => {
  const A = matrix4x4([6, 4, 4, 4, 5, 5, 7, 6, 4, -9, 3, -7, 9, 1, 7, -6]);
  expect(determinant(A)).toBe(-2120);
});

test("Testing a noninvertible matrix for invertibility", () => {
  const A = matrix4x4([-4, 2, -2, -3, 9, 6, 2, 6, 0, -5, 1, -5, 0, 0, 0, 0]);
  expect(determinant(A)).toBe(0);
});

test("Calculating the inverse of a matrix", () => {
  const A = matrix4x4([-5, 2, 6, -8, 1, -5, 1, 8, 7, 7, -6, -7, 1, -3, 7, 4]);
  const B = inverse(A);
  expect(determinant(A)).toBe(532);
  expect(cofactor(A, 2, 3)).toBe(-160);
  expect(B[3][2]).toBeCloseTo(-160 / 532, 5);
  expect(cofactor(A, 3, 2)).toBe(105);
  expect(B[2][3]).toBeCloseTo(105 / 532, 5);
  const B_correct = matrix4x4([
    0.21805, 0.45113, 0.2406, -0.04511, -0.80827, -1.45677, -0.44361, 0.52068,
    -0.07895, -0.22368, -0.05263, 0.19737, -0.52256, -0.81391, -0.30075, 0.30639
  ]);
  expect(matricesEqual(B, B_correct)).toBe(true);
});

test("Calculating the inverse of another matrix", () => {
  const A = matrix4x4([8, -5, 9, 2, 7, 5, 6, 1, -6, 0, 9, 6, -3, 0, -9, -4]);
  const B = inverse(A);
  const B_correct = matrix4x4([
    -0.15385, -0.15385, -0.28205, -0.53846, -0.07692, 0.12308, 0.02564, 0.03077,
    0.35897, 0.35897, 0.4359, 0.92308, -0.69231, -0.69231, -0.76923, -1.92308
  ]);
  expect(matricesEqual(B, B_correct)).toBe(true);
});

test("Calculating the inverse of a third matrix", () => {
  const A = matrix4x4([9, 3, 0, 9, -5, -2, -6, -3, -4, 9, 6, 4, -7, 6, 6, 2]);
  const B = inverse(A);
  const B_correct = matrix4x4([
    -0.04074, -0.07778, 0.14444, -0.22222, -0.07778, 0.03333, 0.36667, -0.33333,
    -0.02901, -0.1463, -0.10926, 0.12963, 0.17778, 0.06667, -0.26667, 0.33333
  ]);
  expect(matricesEqual(B, B_correct)).toBe(true);
});

test("Multiplying a product by its inverse", () => {
  const A = matrix4x4([3, -9, 7, 3, 3, -8, 2, -9, -4, 4, 4, 1, -6, 5, -1, 1]);
  const B = matrix4x4([8, 2, 2, 2, 3, -1, 7, 0, 7, 0, 5, 4, 6, -2, 0, 5]);
  const invB = inverse(B);
  const C = matrix_multiply(A, B);
  const R = matrix_multiply(C, invB);
  expect(matricesEqual(R, A)).toBe(true);
});
