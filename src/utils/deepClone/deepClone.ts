function deepClone(obj: TObj): TObj {
  if (obj === null) return null;
  const clone: any = { ...obj };
  Object.keys(clone).forEach(
    (key) => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]),
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
}

export default deepClone;
