export default function getRandomColor() {
  const seed = 12345; // Use a fixed seed for consistent results
  const random = (seed * 9301 + 49297) % 233280; // Linear congruential generator
  const randomColor = () => Math.floor((random / 233280) * 256);
  return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
}
