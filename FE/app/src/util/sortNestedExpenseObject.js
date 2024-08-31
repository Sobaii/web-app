const sortNestedExpenseObject = (nestedExpenseObject, key, direction) => {
  if (key !== null && Array.isArray(nestedExpenseObject)) {
    // Clone the array using the slice method to avoid modifying the original array
    const clonedArray = nestedExpenseObject.slice();

    clonedArray.sort((a, b) => {
      const aConfidence = a[key]?.confidence || 0;
      const bConfidence = b[key]?.confidence || 0;

      if (aConfidence < bConfidence) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aConfidence > bConfidence) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return clonedArray;
  }
  return nestedExpenseObject.slice(); // Return a shallow copy even if it's not an array
};

export default sortNestedExpenseObject;
