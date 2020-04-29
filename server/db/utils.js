var descriptors = ["L", "M", "N", "S"];

function flatten(o) {
  // flattens single property objects that have descriptors
  for (let d of descriptors) {
    if (o.hasOwnProperty(d)) {
      return o[d];
    }
  }

  Object.keys(o).forEach((k) => {
    for (let d of descriptors) {
      if (o[k].hasOwnProperty(d)) {
        o[k] = o[k][d];
      }
    }
    if (Array.isArray(o[k])) {
      o[k] = o[k].map((e) => flatten(e));
    } else if (typeof o[k] === "object") {
      o[k] = flatten(o[k]);
    }
  });

  return o;
}