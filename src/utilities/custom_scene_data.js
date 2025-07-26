import { Plane } from "../features/planes";
import { Cube } from "../features/cubes";
import { Sphere } from "../features/spheres";
import { Material } from "../features/materials";
import { matrix_multiply as mul } from "../features/matrices";
import { checkers_pattern } from "../features/patterns";
import {
  rotation_x,
  rotation_y,
  rotation_z,
  scaling,
  translation,
  view_transform
} from "../features/transformations";
import { color, point } from "../features/tuples";

const floor = new Plane();
floor.material = new Material();
floor.material.color = color(1, 0.9, 0.9);
floor.material.specular = 0;
floor.material.pattern = checkers_pattern(color(1, 1, 1), color(0.6, 0.6, 0.6));

const left_wall = new Plane();
left_wall.transform = mul(
  translation(0, 0, 5.5),
  mul(rotation_y(-Math.PI / 4), rotation_x(Math.PI / 2))
);
left_wall.material = new Material();
left_wall.material.reflective = 0.3;

const right_wall = new Plane();
right_wall.transform = mul(
  translation(0, 0, 5.5),
  mul(rotation_y(Math.PI / 4), rotation_x(Math.PI / 2))
);
right_wall.material = new Material();
right_wall.material.ambient = 0.1;
right_wall.material.diffuse = 0.5;
right_wall.material.reflective = 0.3;

const updatedCube = new Cube();
const updatedSphere = new Sphere();

const updateScene = (world, camera, cube, sphere, vt) => {
  const cT = translation(
    cube.transforms.translation.x,
    cube.transforms.translation.y,
    cube.transforms.translation.z
  );
  const cS = scaling(
    cube.transforms.scaling.x,
    cube.transforms.scaling.y,
    cube.transforms.scaling.z
  );
  const cRx = rotation_x(cube.transforms.rotation.x);
  const cRy = rotation_y(cube.transforms.rotation.y);
  const cRz = rotation_z(cube.transforms.rotation.z);
  const cM = mul(cRz, mul(cRy, mul(cRx, mul(cS, cT))));
  updatedCube.transform = cM;
  updatedCube.material = cube.material.material;

  const sT = translation(
    sphere.transforms.translation.x,
    sphere.transforms.translation.y,
    sphere.transforms.translation.z
  );
  const sS = scaling(
    sphere.transforms.scaling.x,
    sphere.transforms.scaling.y,
    sphere.transforms.scaling.z
  );
  const sRx = rotation_x(sphere.transforms.rotation.x);
  const sRy = rotation_y(sphere.transforms.rotation.y);
  const sRz = rotation_z(sphere.transforms.rotation.z);
  const sM = mul(sRz, mul(sRy, mul(sRx, mul(sS, sT))));
  updatedSphere.transform = sM;
  updatedSphere.material = sphere.material.material;

  world.objects = [floor, left_wall, right_wall, updatedCube, updatedSphere];

  camera.transform = view_transform(
    point(vt.state.from.x, vt.state.from.y, vt.state.from.z),
    point(vt.state.to.x, vt.state.to.y, vt.state.to.z),
    point(vt.state.up.x, vt.state.up.y, vt.state.up.z)
  );
};

export { updateScene };
