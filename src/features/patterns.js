import { identity_matrix, inverse, matrix_vector_multiply } from "./matrices";
import { world_to_object } from "./shapes";
import { addColors, color, multiplyColorByScalar, subColors } from "./tuples";

class Pattern {
  constructor() {
    if (new.target === Pattern) {
      throw new TypeError("Instantiating base class (Pattern).");
    }
    this.transform = identity_matrix();
  }

  pattern_at(point) {
    return color(point[0], point[1], point[2]);
  }
}

class TestPattern extends Pattern {
  constructor() {
    super();
  }
}

class StripePattern extends Pattern {
  constructor(color_a, color_b) {
    super();
    this.a = color_a;
    this.b = color_b;
  }

  pattern_at(point) {
    if (Math.floor(point[0]) % 2 == 0) {
      return this.a;
    }
    return this.b;
  }
}

class GradientPattern extends Pattern {
  constructor(color_a, color_b) {
    super();
    this.a = color_a;
    this.b = color_b;
  }

  pattern_at(point) {
    const distance = subColors(this.b, this.a);
    const fraction = point[0] - Math.floor(point[0]);

    return addColors(this.a, multiplyColorByScalar(fraction, distance));
  }
}

class RingPattern extends Pattern {
  constructor(color_a, color_b) {
    super();
    this.a = color_a;
    this.b = color_b;
  }

  pattern_at(point) {
    const sum_of_squares = point[0] * point[0] + point[2] * point[2];

    if (Math.floor(Math.sqrt(sum_of_squares)) % 2 === 0) {
      return this.a;
    }

    return this.b;
  }
}

class CheckersPattern extends Pattern {
  constructor(color_a, color_b) {
    super();
    this.a = color_a;
    this.b = color_b;
  }

  pattern_at(point) {
    const sum_of_floors =
      Math.floor(point[0]) + Math.floor(point[1]) + Math.floor(point[2]);

    if (sum_of_floors % 2 === 0) {
      return this.a;
    }

    return this.b;
  }
}

const test_pattern = () => {
  return new TestPattern();
};

const stripe_pattern = (color_a, color_b) => {
  return new StripePattern(color_a, color_b);
};

const gradient_pattern = (color_a, color_b) => {
  return new GradientPattern(color_a, color_b);
};

const ring_pattern = (color_a, color_b) => {
  return new RingPattern(color_a, color_b);
};

const checkers_pattern = (color_a, color_b) => {
  return new CheckersPattern(color_a, color_b);
};

const pattern_at_shape = (pattern, shape, point) => {
  // this takes group transformations into account
  const object_point = world_to_object(shape, point);

  // this works for shapes that do not belong to groups that have transformations
  // const object_point = matrix_vector_multiply(inverse(shape.transform), point);

  const pattern_point = matrix_vector_multiply(
    inverse(pattern.transform),
    object_point
  );
  return pattern.pattern_at(pattern_point);
};

const set_pattern_transform = (pattern, transform) => {
  pattern.transform = transform;
};

export {
  Pattern,
  test_pattern,
  stripe_pattern,
  gradient_pattern,
  ring_pattern,
  checkers_pattern,
  pattern_at_shape,
  set_pattern_transform
};
