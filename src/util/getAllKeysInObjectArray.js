export default function getAllKeysInObjectArray(
  objectsArray,
  excludeKeys = []
) {
  const keyTracker = {};

  objectsArray.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      keyTracker[key] = true;
    });
  });
  return Object.keys(keyTracker).filter((key) => !excludeKeys.includes(key));
}
