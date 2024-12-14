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

// Example usage:
// const objectsArray = [
//   { name: 'Alice', age: 25, city: 'Toronto' },
//   { name: 'Bob', age: 30, country: 'Canada' },
//   { name: 'Charlie', age: 35, city: 'Vancouver' }
// ];

// const excludeKeys = ['age'];

// ['name', 'city', 'country']
