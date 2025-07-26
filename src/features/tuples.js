const EPSILON = 0.00001;

const equal = (a, b) => {
  if (
    Math.abs(a[0] - b[0]) < EPSILON &&
    Math.abs(a[1] - b[1]) < EPSILON &&
    Math.abs(a[2] - b[2]) < EPSILON &&
    Math.abs(a[3] - b[3]) < EPSILON
  ) {
    return true;
  } else {
    return false;
  }
};

const tuple = (x, y, z, w) => {
  return [x, y, z, w];
};

const point = (x, y, z) => {
  return [x, y, z, 1.0];
};

const vector = (x, y, z) => {
  return [x, y, z, 0.0];
};

const add = (a, b) => {
  //return a.map((e, i) => e + b[i]); //slower?
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
};

const sub = (a, b) => {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
};

const negate = (a) => {
  return [-a[0], -a[1], -a[2], -a[3]];
};

const scale = (s, v) => {
  return [s * v[0], s * v[1], s * v[2], s * v[3]];
};

const magnitude = (v) => {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
};

const normalize = (v) => {
  const m = magnitude(v);
  return [v[0] / m, v[1] / m, v[2] / m, v[3] / m];
};

const dot = (a, b) => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

const cross = (a, b) => {
  return vector(
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  );
};

const color = (r, g, b) => {
  return [r, g, b];
};

const addColors = (c1, c2) => {
  return [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
};

const subColors = (c1, c2) => {
  return [c1[0] - c2[0], c1[1] - c2[1], c1[2] - c2[2]];
};

const multiplyColorByScalar = (s, c) => {
  return [s * c[0], s * c[1], s * c[2]];
};

const hadamard_product = (c1, c2) => {
  return [c1[0] * c2[0], c1[1] * c2[1], c1[2] * c2[2]];
};

const reflect = (v, normal) => {
  return sub(v, scale(2 * dot(v, normal), normal));
};

export {
  tuple,
  point,
  vector,
  equal,
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
  reflect,
  EPSILON
};
