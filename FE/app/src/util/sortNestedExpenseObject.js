const sortNestedExpenseObject = (expenseArray, key, direction) => {
  if (key !== null && Array.isArray(expenseArray)) {
    // Clone the array using the slice method to avoid modifying the original array
    const clonedArray = expenseArray.slice();

    clonedArray.sort((a, b) => {
      const aValue = a[key] || 0;
      const bValue = b[key] || 0;

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return clonedArray;
  }
  return expenseArray.slice(); // Return a shallow copy even if it's not an array
};

export default sortNestedExpenseObject;
