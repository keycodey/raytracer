import _ from "lodash";
import { Group } from "./groups";
import { Shape } from "./shapes";
import { intersect } from "./rays";

class CSG extends Shape {
  constructor(operation, s1, s2) {
    super();
    this.operation = operation;
    this.left = s1;
    this.right = s2;
    s1.parent = this;
    s2.parent = this;
  }

  local_intersect(ray) {
    const leftxs = intersect(this.left, ray);
    const rightxs = intersect(this.right, ray);

    const xs = leftxs.concat(rightxs);

    xs.sort(function (a, b) {
      return a.t - b.t;
    });

    return filter_intersections(this, xs);
  }

  local_normal_at(local_point, hit) {
    throw new Error(
      "csg.local_normal_at was called. There is a bug in the code."
    );
  }
}

const intersection_allowed = (op, lhit, inl, inr) => {
  if (op == "union") {
    return (lhit && !inr) || (!lhit && !inl);
  } else if (op == "intersection") {
    return (lhit && inr) || (!lhit && inl);
  } else if (op == "difference") {
    return (lhit && !inr) || (!lhit && inl);
  }

  return false;
};

const filter_intersections = (csg, xs) => {
  // begin outside of both children
  let inl = false;
  let inr = false;

  // prepare a list to receive the filtered intersections
  const result = [];

  xs.forEach((i, index) => {
    // if i.object is part of the "left" child, then lhit is true

    let lhit;

    // left is a Group
    if (csg.left instanceof Group) {
      lhit = dfs(csg.left, i.object);
    }

    // left is a CSG object
    else if (csg.left instanceof CSG) {
      lhit = dfs(csg.left, i.object);
    }

    // left is any other shape
    else {
      lhit = _.isEqual(csg.left, i.object);
    }

    if (intersection_allowed(csg.operation, lhit, inl, inr)) {
      result.push(i);
    }

    // depending on which object was hit, toggle either inl or inr
    if (lhit) {
      inl = !inl;
    } else {
      inr = !inr;
    }
  });

  return result;
};

// depth-first search
const dfs = (obj, target) => {
  if (_.isEqual(obj, target)) {
    return true;
  }

  let isIncluded = false;

  if (obj instanceof Group) {
    const children = obj.shapes;
    children.forEach((child) => {
      isIncluded = isIncluded || dfs(child, target);
    });
  }

  if (obj instanceof CSG) {
    const children = [obj.left, obj.right];
    children.forEach((child) => {
      isIncluded = isIncluded || dfs(child, target);
    });
  }

  return isIncluded;
};

export { CSG, intersection_allowed, filter_intersections };
