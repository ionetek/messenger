function merge(lhs: TObjNullable, rhs: TObjNullable): TObjNullable {
  for (const p in rhs) {
    if (!rhs.hasOwnProperty(p)) {
      continue;
    }

    try {
      if (rhs[p].constructor === Object) {
        if (lhs) {
          rhs[p] = merge(lhs[p], rhs[p]);
        }
      } else {
        if (lhs) {
          lhs[p] = rhs[p];
        }
      }
    } catch (e) {
      if (lhs) {
        lhs[p] = rhs[p];
      }
    }
  }

  return lhs;
}

export default merge;
