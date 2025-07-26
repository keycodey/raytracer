import { lighting, Pointlight } from "../features/lights";
import { Material } from "../features/materials";
import { stripe_pattern } from "../features/patterns";
import { Sphere } from "../features/spheres";
import { color, point, vector } from "../features/tuples";

test("The default material", () => {
  const m = new Material();
  expect(m.color).toStrictEqual(color(1, 1, 1));
  expect(m.ambient).toBe(0.1);
  expect(m.diffuse).toBe(0.9);
  expect(m.specular).toBe(0.9);
  expect(m.shininess).toBe(200.0);
});

describe("Lighting", () => {
  // these are shared by the tests below
  const m = new Material();
  const position = point(0, 0, 0);
  const sphere = new Sphere("sphere");

  test("Lighting with the eye between the light and the surface", () => {
    const eyev = vector(0, 0, -1);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 0, -10), color(1, 1, 1));
    const result = lighting(m, sphere, light, position, eyev, normalv, false);
    expect(result).toStrictEqual(color(1.9, 1.9, 1.9));
  });

  test("Lighting with the eye between the light and surface, eye offset 45 degrees", () => {
    const eyev = vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 0, -10), color(1, 1, 1));
    const result = lighting(m, sphere, light, position, eyev, normalv, false);
    expect(result).toStrictEqual(color(1.0, 1.0, 1.0));
  });

  test("Lighting with eye opposite surface, light offset 45 degrees", () => {
    const eyev = vector(0, 0, -1);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 10, -10), color(1, 1, 1));
    const result = lighting(m, sphere, light, position, eyev, normalv, false);
    expect(result[0]).toBeCloseTo(0.7364, 5);
    expect(result[1]).toBeCloseTo(0.7364, 5);
    expect(result[2]).toBeCloseTo(0.7364, 5);
  });

  test("Lighting with eye in the path of the reflection vector", () => {
    const eyev = vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 10, -10), color(1, 1, 1));
    const result = lighting(m, sphere, light, position, eyev, normalv, false);
    expect(result[0]).toBeCloseTo(1.6364, 5);
    expect(result[1]).toBeCloseTo(1.6364, 5);
    expect(result[2]).toBeCloseTo(1.6364, 5);
  });

  test("Lighting with the light behind the surface", () => {
    const eyev = vector(0, 0, -1);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 0, 10), color(1, 1, 1));
    const result = lighting(m, sphere, light, position, eyev, normalv, true);
    expect(result).toStrictEqual(color(0.1, 0.1, 0.1));
    expect(result[0]).toBeCloseTo(0.1, 5);
    expect(result[1]).toBeCloseTo(0.1, 5);
    expect(result[2]).toBeCloseTo(0.1, 5);
  });

  test("Lighting with the surface in shadow", () => {
    const eyev = vector(0, 0, -1);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 0, -10), color(1, 1, 1));
    const in_shadow = true;
    const result = lighting(
      m,
      sphere,
      light,
      position,
      eyev,
      normalv,
      in_shadow
    );
    expect(result[0]).toBeCloseTo(0.1, 5);
    expect(result[1]).toBeCloseTo(0.1, 5);
    expect(result[2]).toBeCloseTo(0.1, 5);
  });

  test("Lighting with a pattern applied", () => {
    m.pattern = stripe_pattern(color(1, 1, 1), color(0, 0, 0));
    m.ambient = 1;
    m.diffuse = 0;
    m.specular = 0;
    const eyev = vector(0, 0, -1);
    const normalv = vector(0, 0, -1);
    const light = new Pointlight(point(0, 0, -10), color(1, 1, 1));
    const in_shadow = false;
    const c1 = lighting(
      m,
      sphere,
      light,
      point(0.9, 0, 0),
      eyev,
      normalv,
      in_shadow
    );
    const c2 = lighting(
      m,
      sphere,
      light,
      point(1.1, 0, 0),
      eyev,
      normalv,
      in_shadow
    );
    expect(c1).toStrictEqual(color(1, 1, 1));
    expect(c2).toStrictEqual(color(0, 0, 0));
  });
});

test("Reflectivity for the default material", () => {
  const m = new Material();
  expect(m.reflective).toBe(0.0);
});

test("Transparency and Refractive Index for the default material", () => {
  const m = new Material();
  expect(m.transparency).toBe(0.0);
  expect(m.refractive_index).toBe(1.0);
});
