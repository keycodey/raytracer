import { add_child, group } from "./groups";
import { SmoothTriangle } from "./smooth_triangles";
import { Triangle } from "./triangles";
import { point, vector } from "./tuples";

class Parser {
  constructor() {
    this.ignored_lines = 0;
    this.vertices = [""]; // vertices are added starting from index 1
    this.normals = [""]; // the same with normals
    this.groups = { default: group() }; // initialize groups with a group named 'default'
    this.ignore_smooth_triangles = false;
  }

  parse_obj_file(file) {
    const lines = file.trim().split(/\r?\n|\r|\n/g);

    let groupName = "default";

    lines.forEach((line) => {
      const arr = line.trim().split(/[ \t]+/); // split at any continuous segment of spaces or tabs

      if (arr[0] == "g") {
        // change the group name to the group name that is most recently referenced
        groupName = arr[1];
        // if group does not exist in the groups dictionary, then add it to the dict
        if (!this.groups[groupName]) {
          this.groups[groupName] = group();
        }
      } else if (
        arr[0] == "v" &&
        !isNaN(arr[1]) &&
        !isNaN(arr[2]) &&
        !isNaN(arr[3])
      ) {
        this.vertices.push(
          point(Number(arr[1]), Number(arr[2]), Number(arr[3]))
        );
      } else if (
        arr[0] == "vn" &&
        !isNaN(arr[1]) &&
        !isNaN(arr[2]) &&
        !isNaN(arr[3])
      ) {
        this.normals.push(
          vector(Number(arr[1]), Number(arr[2]), Number(arr[3]))
        );
      } else if (arr[0] == "f") {
        const vertices = [""]; // again, make the array 1-based
        const normals = [""]; // same here

        const v_t_vn = arr[1].split("/"); // e.g. f 1/1/1 2/2/2 3/3/3 4/4/4 =>  v_t_vn = [1, 1, 1]

        if (v_t_vn.length == 1) {
          // no vertex normals => triangles
          for (let i = 1; i < arr.length; i++) {
            vertices.push(this.vertices[Number(arr[i])]);
          }

          const triangles = fan_triangulation(vertices);

          triangles.forEach((triangle) => {
            add_child(this.groups[groupName], triangle);
          });
        } else {
          // vertex normals included => smooth triangles
          for (let i = 1; i < arr.length; i++) {
            vertices.push(this.vertices[Number(arr[i].split("/")[0])]);
            normals.push(this.normals[Number(arr[i].split("/")[2])]);
          }

          const smooth_triangles = fan_triangulation_smooth_triangles(
            this.ignore_smooth_triangles, // optionally form ordinary triangles from the data
            vertices,
            normals
          );

          smooth_triangles.forEach((smooth_triangle) => {
            add_child(this.groups[groupName], smooth_triangle);
          });
        }
      } else {
        this.ignored_lines++;
      }
    });
  }

  obj_to_group() {
    const group_ = group();

    for (const [key, value] of Object.entries(this.groups)) {
      add_child(group_, value);
    }

    return group_;
  }
}

// vertices is a 1-based array of at least three vertices
const fan_triangulation = (vertices) => {
  const triangles = [];

  for (let index = 2; index < vertices.length - 1; index++) {
    const tri = new Triangle(vertices[1], vertices[index], vertices[index + 1]);
    triangles.push(tri);
  }

  return triangles;
};

const fan_triangulation_smooth_triangles = (
  ignore_smooth_triangles,
  vertices,
  normals
) => {
  const smooth_triangles = [];

  let tri;

  for (let index = 2; index < vertices.length - 1; index++) {
    if (ignore_smooth_triangles) {
      tri = new Triangle(vertices[1], vertices[index], vertices[index + 1]);
    } else {
      tri = new SmoothTriangle(
        vertices[1],
        vertices[index],
        vertices[index + 1],
        normals[1],
        normals[index],
        normals[index + 1]
      );
    }

    smooth_triangles.push(tri);
  }

  return smooth_triangles;
};

export { Parser };
