const gibberish = `
There was a young lady named Bright
who traveled much faster than light.
She set out one day
in a relative way,
and came back the previous night.
`;

const vertices = `
v -1 1 0
v -1.0000 0.5000 0.0000
v 1 0 0
v 1 1 0
`;

const triangle_faces = `
v -1 1 0
v -1 0 0
v 1 0 0
v 1 1 0

f 1 2 3
f 1 3 4
`;

const polygon = `
v -1 1 0
v -1 0 0
v 1 0 0
v 1 1 0
v 0 2 0

f 1 2 3 4 5
`;

const triangles_obj = `
v -1 1 0
v -1 0 0
v 1 0 0
v 1 1 0

g FirstGroup
f 1 2 3
g SecondGroup
f 1 3 4
`;

const vertex_normals = `
vn 0 0 1
vn 0.707 0 -0.707
vn 1 2 3
`;

const faces_with_normals = `
v 0 1 0
v -1 0 0
v 1 0 0

vn -1 0 0
vn 1 0 0
vn 0 1 0

f 1//3 2//1 3//2
f 1/0/3 2/102/1 3/14/2
`;

export {
  gibberish,
  vertices,
  triangle_faces,
  polygon,
  triangles_obj,
  vertex_normals,
  faces_with_normals
};
