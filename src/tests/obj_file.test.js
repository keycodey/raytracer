import _ from "lodash";
import {
  faces_with_normals,
  gibberish,
  polygon,
  triangle_faces,
  triangles_obj,
  vertex_normals,
  vertices
} from "../data/testdata";
import { Parser } from "../features/obj_file";
import { point, vector } from "../features/tuples";

test("Ignoring unrecognized lines", () => {
  const gibberish_ = gibberish;
  const parser = new Parser();
  parser.parse_obj_file(gibberish_);
  expect(parser.ignored_lines).toBe(5);
});

test("Vertex records", () => {
  const file = vertices;
  const parser = new Parser();
  parser.parse_obj_file(file);
  expect(parser.ignored_lines).toBe(0);
  expect(parser.vertices[1]).toStrictEqual(point(-1, 1, 0));
  expect(parser.vertices[2]).toStrictEqual(point(-1, 0.5, 0));
  expect(parser.vertices[3]).toStrictEqual(point(1, 0, 0));
  expect(parser.vertices[4]).toStrictEqual(point(1, 1, 0));
});

test("Parsing triangle faces", () => {
  const file = triangle_faces;
  const parser = new Parser();
  parser.parse_obj_file(file);
  const g = parser.groups["default"];
  const t1 = g.shapes[0];
  const t2 = g.shapes[1];
  expect(t1.p1).toStrictEqual(parser.vertices[1]);
  expect(t1.p2).toStrictEqual(parser.vertices[2]);
  expect(t1.p3).toStrictEqual(parser.vertices[3]);
  expect(t2.p1).toStrictEqual(parser.vertices[1]);
  expect(t2.p2).toStrictEqual(parser.vertices[3]);
  expect(t2.p3).toStrictEqual(parser.vertices[4]);
});

test("Triangulating polygons", () => {
  const file = polygon;
  const parser = new Parser();
  parser.parse_obj_file(file);
  const g = parser.groups["default"];
  const t1 = g.shapes[0];
  const t2 = g.shapes[1];
  const t3 = g.shapes[2];
  expect(t1.p1).toStrictEqual(parser.vertices[1]);
  expect(t1.p2).toStrictEqual(parser.vertices[2]);
  expect(t1.p3).toStrictEqual(parser.vertices[3]);
  expect(t2.p1).toStrictEqual(parser.vertices[1]);
  expect(t2.p2).toStrictEqual(parser.vertices[3]);
  expect(t2.p3).toStrictEqual(parser.vertices[4]);
  expect(t3.p1).toStrictEqual(parser.vertices[1]);
  expect(t3.p2).toStrictEqual(parser.vertices[4]);
  expect(t3.p3).toStrictEqual(parser.vertices[5]);
});

test("Triangles in a group", () => {
  const file = triangles_obj;
  const parser = new Parser();
  parser.parse_obj_file(file);
  const g1 = parser.groups["FirstGroup"];
  const g2 = parser.groups["SecondGroup"];
  const t1 = g1.shapes[0];
  const t2 = g2.shapes[0];
  expect(t1.p1).toStrictEqual(parser.vertices[1]);
  expect(t1.p2).toStrictEqual(parser.vertices[2]);
  expect(t1.p3).toStrictEqual(parser.vertices[3]);
  expect(t2.p1).toStrictEqual(parser.vertices[1]);
  expect(t2.p2).toStrictEqual(parser.vertices[3]);
  expect(t2.p3).toStrictEqual(parser.vertices[4]);
});

test("Converting an OBJ file to a group", () => {
  const file = triangles_obj;
  const parser = new Parser();
  parser.parse_obj_file(file);
  const g = parser.obj_to_group();
  // parser has named groups, but obj_to_group "loses" the names
  const g1 = g.shapes[1]; // "FirstGroup" / g.shapes[0] is the 'default' group
  const t1 = g1.shapes[0];
  const g2 = g.shapes[2]; // "SecondGroup"
  const t2 = g2.shapes[0];
  expect(t1.p1).toStrictEqual(parser.vertices[1]);
  expect(t1.p2).toStrictEqual(parser.vertices[2]);
  expect(t1.p3).toStrictEqual(parser.vertices[3]);
  expect(t2.p1).toStrictEqual(parser.vertices[1]);
  expect(t2.p2).toStrictEqual(parser.vertices[3]);
  expect(t2.p3).toStrictEqual(parser.vertices[4]);
});

test("Vertex normal records", () => {
  const file = vertex_normals;
  const parser = new Parser();
  parser.parse_obj_file(file);
  expect(parser.normals[1]).toStrictEqual(vector(0, 0, 1));
  expect(parser.normals[2]).toStrictEqual(vector(0.707, 0, -0.707));
  expect(parser.normals[3]).toStrictEqual(vector(1, 2, 3));
});

test("Faces with normals", () => {
  const file = faces_with_normals;
  const parser = new Parser();
  parser.parse_obj_file(file);
  const g = parser.groups["default"];
  const t1 = g.shapes[0];
  const t2 = g.shapes[1];
  expect(t1.p1).toStrictEqual(parser.vertices[1]);
  expect(t1.p2).toStrictEqual(parser.vertices[2]);
  expect(t1.p3).toStrictEqual(parser.vertices[3]);
  expect(t1.n1).toStrictEqual(parser.normals[3]);
  expect(t1.n2).toStrictEqual(parser.normals[1]);
  expect(t1.n3).toStrictEqual(parser.normals[2]);
  expect(_.isEqual(t1, t2)).toBe(true);
});
