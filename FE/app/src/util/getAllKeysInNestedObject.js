export default function getAllKeysInNestedObject(nested_object) {
  const allKeys =
    nested_object.length > 0
      ? nested_object.reduce((acc, expense) => {
          Object.keys(expense).forEach((key) => {
            if (!acc.includes(key) && key !== "_id") {
              acc.push(key);
            }
          });
          return acc;
        }, [])
      : [];
  return allKeys;
}
