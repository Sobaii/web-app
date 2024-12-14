// src/utils/expenseUtils.js
export const sortNestedExpenseObject = (expenses, key, direction) => {
  return expenses.sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    // Handle nested objects
    if (typeof aValue === "object" && aValue !== null) {
      aValue = Object.values(aValue)[0];
    }
    if (typeof bValue === "object" && bValue !== null) {
      bValue = Object.values(bValue)[0];
    }

    if (aValue < bValue) {
      return direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
};

export const getBackgroundColor = (confidence) => {
  const hue = 120 - (120 * (100 - confidence)) / 100;
  const saturationStart = 64;
  const saturationEnd = 40;
  const saturation =
    saturationStart +
    ((saturationEnd - saturationStart) * (100 - confidence)) / 100;

  const lightnessStart = 71;
  const lightnessEnd = 80;
  const lightness =
    lightnessStart +
    ((lightnessEnd - lightnessStart) * (100 - confidence)) / 100;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const numericKeys = ["subtotal", "totalTax", "total", "gratuity"];
