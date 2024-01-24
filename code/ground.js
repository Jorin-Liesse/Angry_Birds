export class Ground {
  constructor(position, size) {
    this.canvas = document.getElementById("mainCanvas");

    this.relativePosition = { x: position.x / this.canvas.width, y: position.y / this.canvas.height };
    this.relativeSize = { x: size.x / this.canvas.width, y: size.y / this.canvas.height };

    this.position = position;
    this.size = size;
  }

  update(dt, inputs) {}

  draw() {}

  resize() {
    this.position = {
      x: this.canvas.width * this.relativePosition.x,
      y: this.canvas.height * this.relativePosition.y,
    };

    this.size = {
      x: this.canvas.width * this.relativeSize.x,
      y: this.canvas.height * this.relativeSize.y,
    };
  }
}
