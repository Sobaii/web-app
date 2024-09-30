export default function formatCamelCase(input) {
  // Add a space before each capital letter and capitalize the first letter of the result
  const formattedString = input
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

  return formattedString;
}
