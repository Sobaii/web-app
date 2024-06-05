import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBackgroundColor(confidence: number): string {
  // Hue: Transition from green (120 degrees) to red (0 degrees)
  const hue = 120 - (120 * (100 - confidence) / 100);

  // Saturation: Start from 64% (for the specific green) and decrease slightly to achieve a pastel effect
  const saturationStart = 64;
  const saturationEnd = 40; // End value for saturation when confidence is 0%
  const saturation = saturationStart + (saturationEnd - saturationStart) * (100 - confidence) / 100;

  // Lightness: Start from 71% (for the specific green) and adjust slightly to keep the pastel effect
  const lightnessStart = 71;
  const lightnessEnd = 80; // End value for lightness when confidence is 0%, to ensure the red is also pastel
  const lightness = lightnessStart + (lightnessEnd - lightnessStart) * (100 - confidence) / 100;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


export function getAllKeysInNestedObject(nested_object) {
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

export const sortNestedExpenseObject = (nestedExpenseObject, key, direction) => {
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

export function formatSnakeCase(input) {
  // Split the string by underscores
  const words = input.split("_");

  // Capitalize the first letter of each word and join them with a space
  const formattedWords = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return `${formattedWords}`;
}
