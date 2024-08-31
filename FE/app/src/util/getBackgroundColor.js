export default function getBackgroundColor(confidence) {
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
