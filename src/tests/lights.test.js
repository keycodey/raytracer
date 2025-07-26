import { Pointlight } from "../features/lights";
import { color, point } from "../features/tuples";

test("A point light has a position and intensity", () => {
  const intensity = color(1, 1, 1);
  const position = point(0, 0, 0);
  const light = new Pointlight(position, intensity);
  expect(light.position).toStrictEqual(position);
  expect(light.intensity).toStrictEqual(intensity);
});
