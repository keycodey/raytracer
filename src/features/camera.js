import { identity_matrix, inverse, matrix_vector_multiply } from "./matrices";
import { Ray } from "./rays";
import { normalize, point, sub } from "./tuples";
import { color_at } from "./world";

class Camera {
  constructor(hsize, vsize, field_of_view) {
    this.hsize = hsize;
    this.vsize = vsize;
    this.field_of_view = field_of_view;
    this.transform = identity_matrix();
    this.init();
  }

  init() {
    const half_view = Math.tan(this.field_of_view / 2);
    const aspect = this.hsize / this.vsize;

    if (aspect >= 1) {
      this.half_width = half_view;
      this.half_height = half_view / aspect;
    } else {
      this.half_width = half_view * aspect;
      this.half_height = half_view;
    }

    this.pixel_size = (this.half_width * 2) / this.hsize;
  }
}

const ray_for_pixel = (camera, px, py) => {
  // the offset from the edge of the canvas to the pixel's center
  const xoffset = (px + 0.5) * camera.pixel_size;
  const yoffset = (py + 0.5) * camera.pixel_size;

  // the untransformed coordinates of the pixel in world space
  // (note: camera looks toward -z, so +x is to the "left")
  const world_x = camera.half_width - xoffset;
  const world_y = camera.half_height - yoffset;

  // using the camera matrix, transform the canvas point and the origin
  // and then compute the ray's direction vector (note: the canvas is at z=-1)
  const pixel = matrix_vector_multiply(
    inverse(camera.transform),
    point(world_x, world_y, -1)
  );
  const origin = matrix_vector_multiply(
    inverse(camera.transform),
    point(0, 0, 0)
  );
  const direction = normalize(sub(pixel, origin));

  return new Ray(origin, direction);
};

const render = (ctx, camera, world) => {
  // ctx == canvas.getContext("2d")
  for (let y = 0; y < camera.vsize; y++) {
    for (let x = 0; x < camera.hsize; x++) {
      const ray = ray_for_pixel(camera, x, y);
      const color = color_at(world, ray, 4);

      ctx.fillStyle = `rgb(${Math.floor(255 * color[0])} ${Math.floor(
        255 * color[1]
      )} ${Math.floor(255 * color[2])})`;

      ctx.fillRect(x, y, 1, 1);
    }
  }
};

const render_line_by_line = (y, y_limit, ctx, camera, world) => {
  for (let x = 0; x < camera.hsize; x++) {
    const ray = ray_for_pixel(camera, x, y);
    const color = color_at(world, ray, 4);

    ctx.fillStyle = `rgb(${Math.floor(255 * color[0])} ${Math.floor(
      255 * color[1]
    )} ${Math.floor(255 * color[2])})`;

    ctx.fillRect(x, y, 1, 1);
  }
  if (y < y_limit) {
    y++;
    setTimeout(() => render_line_by_line(y, y_limit, ctx, camera, world), 1);
  }
};

const test_render = (camera, world, x, y) => {
  const ray = ray_for_pixel(camera, x, y);
  const color = color_at(world, ray, 4);
  return color;
};

export { Camera, ray_for_pixel, render, test_render, render_line_by_line };
