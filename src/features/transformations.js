import { matrix4x4, matrix_multiply } from "./matrices";
import { cross, normalize, sub } from "./tuples";

const translation = (x, y, z) => {
  return [
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1]
  ];
};

const scaling = (x, y, z) => {
  return [
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1]
  ];
};

const rotation_x = (r) => {
  return [
    [1, 0, 0, 0],
    [0, Math.cos(r), -Math.sin(r), 0],
    [0, Math.sin(r), Math.cos(r), 0],
    [0, 0, 0, 1]
  ];
};

const rotation_y = (r) => {
  return [
    [Math.cos(r), 0, Math.sin(r), 0],
    [0, 1, 0, 0],
    [-Math.sin(r), 0, Math.cos(r), 0],
    [0, 0, 0, 1]
  ];
};

const rotation_z = (r) => {
  return [
    [Math.cos(r), -Math.sin(r), 0, 0],
    [Math.sin(r), Math.cos(r), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
};

const shearing = (xy, xz, yx, yz, zx, zy) => {
  return [
    [1, xy, xz, 0],
    [yx, 1, yz, 0],
    [zx, zy, 1, 0],
    [0, 0, 0, 1]
  ];
};

const view_transform = (from, to, up) => {
  const forward = normalize(sub(to, from));
  const upn = normalize(up);
  const left = cross(forward, upn);
  const true_up = cross(left, forward);

  const orientation = matrix4x4([
    left[0],
    left[1],
    left[2],
    0,
    true_up[0],
    true_up[1],
    true_up[2],
    0,
    -forward[0],
    -forward[1],
    -forward[2],
    0,
    0,
    0,
    0,
    1
  ]);

  return matrix_multiply(
    orientation,
    translation(-from[0], -from[1], -from[2])
  );
};

export {
  translation,
  scaling,
  rotation_x,
  rotation_y,
  rotation_z,
  shearing,
  view_transform
};
