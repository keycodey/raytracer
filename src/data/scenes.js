import { Plane } from "../features/planes";
import { Sphere } from "../features/spheres";
import { Cube } from "../features/cubes";
import { Cylinder } from "../features/cylinders";
import { CSG } from "../features/csg";
import {
  rotation_x,
  rotation_y,
  rotation_z,
  translation,
  scaling
} from "../features/transformations";
import { Material } from "../features/materials";
import { checkers_pattern, stripe_pattern } from "../features/patterns";
import { matrix_multiply } from "../features/matrices";
import { color } from "../features/tuples";
import { teapot_obj } from "../data/objects/teapot";
import { Parser } from "../features/obj_file";

const floor = new Plane();
floor.material = new Material();
floor.material.specular = 0;
floor.material.pattern = checkers_pattern(color(1, 1, 1), color(0.7, 0.7, 0.7));

const left_wall = new Plane();
left_wall.transform = matrix_multiply(
  translation(0, 0, 5),
  matrix_multiply(rotation_y(0), rotation_x(Math.PI / 2))
);

left_wall.material = new Material();
left_wall.material.color = color(0.9, 0.9, 0.9);
left_wall.material.specular = 0.0;

const right_wall = new Plane();
right_wall.transform = matrix_multiply(
  translation(5, 0, 0),
  matrix_multiply(rotation_y(Math.PI / 2), rotation_x(Math.PI / 2))
);
right_wall.material = new Material();
right_wall.material.color = color(0.7, 0.7, 0.7);
right_wall.material.reflective = 0.3;

const back_wall = new Plane();
back_wall.transform = matrix_multiply(
  translation(-11, 0, 0),
  matrix_multiply(rotation_y(Math.PI / 2), rotation_x(Math.PI / 2))
);

const base_objects = [floor, left_wall, right_wall, back_wall];

const material_a = new Material();
material_a.color = color(0.82, 0.82, 1);
material_a.ambient = 0.25;

const material_b = new Material();
material_b.color = color(0.82, 0.84, 0.86);
material_b.ambient = 0.0;
material_b.reflective = 0.2;

const material_c = new Material();
material_c.ambient = 0.4;
material_c.diffuse = 1;
material_c.reflective = 0.0;
material_c.pattern = stripe_pattern(color(2, 0.3, 0.5), color(0.6, 0.5, 0.5));
material_c.pattern.transform = matrix_multiply(
  rotation_z(Math.PI / 2),
  scaling(0.3, 0.3, 0.3)
);

const material_d = new Material();
material_d.color = color(0.1, 0.0, 0.0);
material_d.ambient = 0.1;
material_d.diffuse = 0.1;
material_d.transparency = 0.8;

const material_d2 = new Material();
material_d2.color = color(0.9, 1.0, 0.9);
material_d2.ambient = 0.2;
material_d2.diffuse = 0.7;

const sphere_a = new Sphere();
sphere_a.transform = translation(-0.5, 1, -1);
sphere_a.material = material_a;

const cube_a = new Cube();
cube_a.transform = matrix_multiply(
  translation(0, 1, 0),
  matrix_multiply(rotation_y(Math.PI / 2), scaling(0.5, 1, 1.6))
);
cube_a.material = material_b;

const cube_b = new Cube();
cube_b.transform = matrix_multiply(
  translation(0.7, 0.3, -1.5),
  matrix_multiply(rotation_y(Math.PI / 4), scaling(0.3, 0.3, 0.3))
);
cube_b.material = material_d2;

const cube_c = new Cube();
cube_c.transform = matrix_multiply(
  translation(0, 1, 0),
  matrix_multiply(rotation_y(Math.PI / 3), scaling(1, 1.2, 1))
);
cube_c.material = material_d;

const cylinder_a = new Cylinder();
cylinder_a.minimum = 0;
cylinder_a.maximum = 2.6;
cylinder_a.closed = true;
cylinder_a.transform = matrix_multiply(translation(0, 0, 0), rotation_y(0));
cylinder_a.material = material_c;

const file = teapot_obj;
const parser = new Parser();
parser.parse_obj_file(file);
const g = parser.obj_to_group();

const teapot = g.shapes[1];
const A = matrix_multiply(rotation_x(-Math.PI / 2), scaling(0.13, 0.13, 0.13));
const B = matrix_multiply(translation(1, 0, -2.5), rotation_y(Math.PI / 4));
const C = matrix_multiply(B, A);
teapot.transform = C;

const teapot_material = new Material();
teapot_material.color = color(0.88, 0.62, 0.48);
teapot_material.reflective = 0.3;

teapot.shapes.forEach((shape) => {
  shape.material = teapot_material;
});

//CSG
const cube_d = new Cube();
cube_d.transform = matrix_multiply(
  translation(-0.5, 0.9, 0.5),
  matrix_multiply(rotation_y(Math.PI / 4), scaling(0.5, 0.1, 0.5))
);
cube_d.material = new Material();
cube_d.material.color = color(0.1, 1, 0.5);
cube_d.material.diffuse = 0.7;
cube_d.material.specular = 0.3;
cube_d.material.casts_shadows = true;

const sphere_b = new Sphere();
sphere_b.transform = matrix_multiply(
  translation(-1.4, 0.33, -1.1),
  scaling(0.33, 0.33, 0.33)
);
sphere_b.material = new Material();
sphere_b.material.color = color(0.4, 0.4, 1);
sphere_b.material.diffuse = 0.7;
sphere_b.material.specular = 0.3;
sphere_b.reflective = 0.6;

const cube_e = new Cube();
cube_e.transform = matrix_multiply(
  rotation_y(-Math.PI / 4),
  matrix_multiply(translation(0, 1, 0), scaling(0.5, 1.2, 1.2))
);

const material_e = new Material();
material_e.color = color(0.7, 0.7, 0.7);
material_e.ambient = 0.3;
cube_e.material = material_e;

const sphere_c = new Sphere();
sphere_c.transform = matrix_multiply(
  rotation_y(0),
  matrix_multiply(translation(0.5, 2, -0.5), scaling(1, 1, 1))
);

const material_f = new Material();
material_f.color = color(0.8, 0.6, 0.6);
material_f.ambient = 0.3;
sphere_c.material = material_f;

const cylinder_b = new Cylinder();
cylinder_b.minimum = 0;
cylinder_b.maximum = 1;
cylinder_b.closed = true;
cylinder_b.transform = matrix_multiply(
  translation(0.6, 0.7, 1),
  matrix_multiply(
    rotation_y(-Math.PI / 4),
    matrix_multiply(rotation_z(Math.PI / 2), scaling(0.45, 2.7, 0.45))
  )
);

const material_g = new Material();
material_g.color = color(0.8, 1, 0.8);
material_g.ambient = 0.3;
cylinder_b.material = material_g;

const csg_a = new CSG("difference", cube_e, sphere_c);
const csg_b = new CSG("difference", csg_a, cylinder_b);
csg_b.transform = translation(-0.4, 0, -1);

const scenes = [
  {
    title: "Planes",
    description: "Pattern on the floor and a reflective wall",
    objects: base_objects
  },
  {
    title: "Shapes",
    description: "Primitive shapes include spheres, cubes, etc.",
    objects: [...base_objects, sphere_a]
  },
  {
    title: "Transforms",
    description: "Objects can be translated, scaled and rotated",
    objects: [...base_objects, cube_a, cube_b]
  },
  {
    title: "Materials",
    description: "A cylinder with a striped glowy material",
    objects: [...base_objects, cylinder_a]
  },
  {
    title: "Transparency",
    description: "Materials support transparency",
    objects: [...base_objects, cube_c]
  },
  {
    title: "OBJ Files",
    description: "3D model of a teapot (slow to render)",
    objects: [floor, left_wall, right_wall, teapot]
  },
  {
    title: "Constructive solid geometry",
    description: "Unions, intersections, and differences",
    objects: [...base_objects, csg_b]
  }
];

export { scenes };
