export default function formatSnakeCase(input) {
  // Split the string by underscores
  const words = input.split("_");

  // Capitalize the first letter of each word and join them with a space
  const formattedWords = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return `${formattedWords}`;
}
