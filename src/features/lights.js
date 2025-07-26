import { pattern_at_shape } from "./patterns";
import {
  addColors,
  color,
  dot,
  hadamard_product,
  multiplyColorByScalar,
  negate,
  normalize,
  reflect,
  sub
} from "./tuples";

class Pointlight {
  constructor(position, intensity) {
    this.position = position;
    this.intensity = intensity;
  }
}

const lighting = (material, object, light, point, eyev, normalv, in_shadow) => {
  let color_;
  if (material.pattern != null) {
    color_ = pattern_at_shape(material.pattern, object, point);
  } else {
    color_ = material.color;
  }

  // combine the surface color with the light's color/intensity
  const effective_color = hadamard_product(color_, light.intensity);

  // find the direction to the light source
  const lightv = normalize(sub(light.position, point));

  // compute the ambient contribution
  const ambient = multiplyColorByScalar(material.ambient, effective_color);

  let diffuse;
  let specular;

  // light_dot_normal represents the cosine of the angle between the
  // light vector and the normal vector. A negative number means the
  // light is on the other side of the surface
  const light_dot_normal = dot(lightv, normalv);
  if (light_dot_normal < 0) {
    diffuse = color(0, 0, 0);
    specular = color(0, 0, 0);
  } else {
    // compute the diffuse contribution
    diffuse = multiplyColorByScalar(
      material.diffuse * light_dot_normal,
      effective_color
    );

    // reflect_dot_eye represents the cosine of the angle between the
    // reflection vector and the eye vector. A negative number means the
    // light reflects away from the eye.
    const reflectv = reflect(negate(lightv), normalv);
    const reflect_dot_eye = dot(reflectv, eyev);

    if (reflect_dot_eye <= 0) {
      specular = color(0, 0, 0);
    } else {
      // compute the specular contribution
      const factor = Math.pow(reflect_dot_eye, material.shininess);
      specular = multiplyColorByScalar(
        material.specular * factor,
        light.intensity
      );
    }
  }

  if (in_shadow) {
    return ambient;
  }

  // Add the three contributions together to get the final shading
  return addColors(addColors(ambient, diffuse), specular);
};

export { Pointlight, lighting };
