import { Camera, ray_for_pixel, test_render } from "../features/camera";
import {
  identity_matrix,
  matricesEqual,
  matrix_multiply
} from "../features/matrices";
import {
  rotation_y,
  translation,
  view_transform
} from "../features/transformations";
import { point, vector } from "../features/tuples";
import { default_world } from "../features/world";

test("Constructing a camera", () => {
  const hsize = 160;
  const vsize = 120;
  const field_of_view = Math.PI / 2;
  const c = new Camera(hsize, vsize, field_of_view);
  expect(c.hsize).toBe(160);
  expect(c.vsize).toBe(120);
  expect(c.field_of_view).toBe(Math.PI / 2);
  expect(matricesEqual(c.transform, identity_matrix())).toBe(true);
});

test("The pixel size for a horizontal canvas", () => {
  const c = new Camera(200, 125, Math.PI / 2);
  expect(c.pixel_size).toBeCloseTo(0.01, 5);
});

test("The pixel size for a vertical canvas", () => {
  const c = new Camera(125, 200, Math.PI / 2);
  expect(c.pixel_size).toBeCloseTo(0.01, 5);
});

test("Constructing a ray through the center of the canvas", () => {
  const c = new Camera(201, 101, Math.PI / 2);
  const r = ray_for_pixel(c, 100, 50);
  expect(r.origin).toStrictEqual(point(0, 0, 0));
  //expect(r.direction).toStrictEqual(vector(0, 0, -1));
  expect(r.direction[0]).toBeCloseTo(0, 5);
  expect(r.direction[1]).toBeCloseTo(0, 5);
  expect(r.direction[2]).toBeCloseTo(-1, 5);
});

test("Constructing a ray through a corner of the canvas", () => {
  const c = new Camera(201, 101, Math.PI / 2);
  const r = ray_for_pixel(c, 0, 0);
  expect(r.origin).toStrictEqual(point(0, 0, 0));
  expect(r.direction[0]).toBeCloseTo(0.66519, 5);
  expect(r.direction[1]).toBeCloseTo(0.33259, 5);
  expect(r.direction[2]).toBeCloseTo(-0.66851, 5);
});

test("Constructing a ray when the camera is transformed", () => {
  const c = new Camera(201, 101, Math.PI / 2);
  c.transform = matrix_multiply(rotation_y(Math.PI / 4), translation(0, -2, 5));
  const r = ray_for_pixel(c, 100, 50);
  expect(r.origin).toStrictEqual(point(0, 2, -5));
  expect(r.direction[0]).toBeCloseTo(Math.sqrt(2) / 2, 5);
  expect(r.direction[1]).toBeCloseTo(0.0, 5);
  expect(r.direction[2]).toBeCloseTo(-Math.sqrt(2) / 2, 5);
});

test("Rendering a world with a camera", () => {
  const w = default_world();
  const c = new Camera(11, 11, Math.PI / 2);
  const from = point(0, 0, -5);
  const to = point(0, 0, 0);
  const up = vector(0, 1, 0);
  c.transform = view_transform(from, to, up);
  const c55 = test_render(c, w, 5, 5);
  expect(c55[0]).toBeCloseTo(0.38066, 5);
  expect(c55[1]).toBeCloseTo(0.47583, 5);
  expect(c55[2]).toBeCloseTo(0.2855, 5);
});
