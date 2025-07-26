import { identity_matrix, matricesEqual } from "../features/matrices";
import {
  set_pattern_transform,
  pattern_at_shape,
  stripe_pattern,
  test_pattern,
  gradient_pattern,
  ring_pattern,
  checkers_pattern
} from "../features/patterns";
import { set_transform } from "../features/shapes";
import { Sphere } from "../features/spheres";
import { scaling, translation } from "../features/transformations";
import { color, point } from "../features/tuples";

describe("Stripe patterns", () => {
  // these are shared by the tests below
  const black = color(0, 0, 0);
  const white = color(1, 1, 1);

  test("Creating a stripe pattern", () => {
    const pattern = stripe_pattern(white, black);
    expect(pattern.a).toStrictEqual(white);
    expect(pattern.b).toStrictEqual(black);
  });

  test("A stripe pattern is constant in y", () => {
    const pattern = stripe_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 1, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 2, 0))).toStrictEqual(white);
  });

  test("A stripe pattern is constant in z", () => {
    const pattern = stripe_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 0, 1))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 0, 2))).toStrictEqual(white);
  });

  test("A stripe pattern alternates in x", () => {
    const pattern = stripe_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0.9, 0, 1))).toStrictEqual(white);
    expect(pattern.pattern_at(point(1, 0, 0))).toStrictEqual(black);
    expect(pattern.pattern_at(point(-0.1, 0, 0))).toStrictEqual(black);
    expect(pattern.pattern_at(point(-1, 0, 0))).toStrictEqual(black);
    expect(pattern.pattern_at(point(-1.1, 0, 0))).toStrictEqual(white);
  });

  test("Stripes with an object transformation", () => {
    const object = new Sphere("sphere");
    set_transform(object, scaling(2, 2, 2));
    const pattern = stripe_pattern(white, black);
    const c = pattern_at_shape(pattern, object, point(1.5, 0, 0));
    expect(c).toStrictEqual(white);
  });

  test("Stripes with a pattern transformation", () => {
    const object = new Sphere("sphere");
    const pattern = stripe_pattern(white, black);
    set_pattern_transform(pattern, scaling(2, 2, 2));
    const c = pattern_at_shape(pattern, object, point(1.5, 0, 0));
    expect(c).toStrictEqual(white);
  });

  test("Stripes with both an object an a pattern transformation", () => {
    const object = new Sphere("sphere");
    set_transform(object, scaling(2, 2, 2));
    const pattern = stripe_pattern(white, black);
    set_pattern_transform(pattern, translation(0.5, 0, 0));
    const c = pattern_at_shape(pattern, object, point(2.5, 0, 0));
    expect(c).toStrictEqual(white);
  });

  test("A gradient linearly interpolates between colors", () => {
    const pattern = gradient_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0.25, 0, 0))).toStrictEqual(
      color(0.75, 0.75, 0.75)
    );
    expect(pattern.pattern_at(point(0.5, 0, 0))).toStrictEqual(
      color(0.5, 0.5, 0.5)
    );
    expect(pattern.pattern_at(point(0.75, 0, 0))).toStrictEqual(
      color(0.25, 0.25, 0.25)
    );
  });

  test("A ring should extend in both x and z", () => {
    const pattern = ring_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(1, 0, 0))).toStrictEqual(black);
    expect(pattern.pattern_at(point(0, 0, 1))).toStrictEqual(black);
    // 0.708 = just slightly more than sqrt(2) / 2
    expect(pattern.pattern_at(point(0.708, 0, 0.708))).toStrictEqual(black);
  });

  test("Checkers should repeat in x", () => {
    const pattern = checkers_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0.99, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(1.01, 0, 0))).toStrictEqual(black);
  });

  test("Checkers should repeat in y", () => {
    const pattern = checkers_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 0.99, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 1.01, 0))).toStrictEqual(black);
  });

  test("Checkers should repeat in z", () => {
    const pattern = checkers_pattern(white, black);
    expect(pattern.pattern_at(point(0, 0, 0))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 0, 0.99))).toStrictEqual(white);
    expect(pattern.pattern_at(point(0, 0, 1.01))).toStrictEqual(black);
  });
});

test("The default pattern transformation", () => {
  const pattern = test_pattern();
  expect(matricesEqual(pattern.transform, identity_matrix())).toBe(true);
});

test("Assigning a transformation", () => {
  const pattern = test_pattern();
  set_pattern_transform(pattern, translation(1, 2, 3));
  expect(matricesEqual(pattern.transform, translation(1, 2, 3))).toBe(true);
});

test("A pattern with an object transformation", () => {
  const shape = new Sphere("sphere");
  set_transform(shape, scaling(2, 2, 2));
  const pattern = test_pattern();
  const c = pattern_at_shape(pattern, shape, point(2, 3, 4));
  expect(c).toStrictEqual(color(1, 1.5, 2));
});

test("A pattern with a pattern transformation", () => {
  const shape = new Sphere("sphere");
  const pattern = test_pattern();
  set_pattern_transform(pattern, scaling(2, 2, 2));
  const c = pattern_at_shape(pattern, shape, point(2, 3, 4));
  expect(c).toStrictEqual(color(1, 1.5, 2));
});

test("A pattern with both an object an a pattern transformation", () => {
  const shape = new Sphere("sphere");
  set_transform(shape, scaling(2, 2, 2));
  const pattern = test_pattern();
  set_pattern_transform(pattern, translation(0.5, 1, 1.5));
  const c = pattern_at_shape(pattern, shape, point(2.5, 3, 3.5));
  expect(c).toStrictEqual(color(0.75, 0.5, 0.25));
});
