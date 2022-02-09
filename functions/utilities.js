module.exports.filterObject = (obj, key) => {
  const asArray = Object.entries(obj);
  const filtered = asArray.filter(([objectKey, objectValue])=> objectKey != key);

  return Object.fromEntries(filtered);
};
