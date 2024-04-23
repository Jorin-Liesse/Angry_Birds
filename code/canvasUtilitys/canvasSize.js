let canvasWidth = 0;
let canvasHeight = 0;

export function getCanvasSize() {
  return {x: canvasWidth, y: canvasHeight};
}

export function setCanvasSize(width, height) {
  canvasWidth = width;
  canvasHeight = height;
}
