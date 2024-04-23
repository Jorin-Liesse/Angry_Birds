export function normalizeVector(vector) {
  // Calculate the magnitude of the vector
  const magnitude = calculateMagnitude(vector);

  // Normalize the vector
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
}

export function magnitude(vector) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

export function rotatePoint(center, point, angle) {
  let dx = point.x - center.x;
  let dy = point.y - center.y;

  let newX = center.x + dx * Math.cos(angle) - dy * Math.sin(angle);
  let newY = center.y + dx * Math.sin(angle) + dy * Math.cos(angle);

  return { x: newX, y: newY };
}

export function slope(a, b, x) {
  let slope = (2 * a * x + b);
  return slope;
}
