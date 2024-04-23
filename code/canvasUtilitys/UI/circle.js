import { getCanvasSize } from "../canvasSize.js";

export class Circle {
  #ctx;
  
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      position: { x: 0.5, y: 0.5 },
      radius: 0.25,
      width: 0.01,
      strokeColor: "#000000",
      fillColor: "#ffffff"
    };

    data = { ...defaultData, ...data };

    const canvas = document.getElementById("mainCanvas");
    this.#ctx = canvas.getContext("2d");

    this.refPosition = data.position;
    this.refRadius = data.radius;
    this.refWidth = data.width;
    this.strokeColor = data.strokeColor;
    this.fillColor = data.fillColor;
    
    this.visible = true;

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {}

  draw() {
    if (!this.visible) return;
    this.#ctx.save();

    this.#ctx.strokeStyle = this.strokeColor;
    this.#ctx.fillStyle = this.fillColor;
    this.#ctx.lineWidth = this.width;

    this.#ctx.beginPath();
    this.#ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.#ctx.fill();
    this.#ctx.stroke();

    this.#ctx.restore();
  }

  resize(screenPosition, screenSize) {
    this.#calculateRef(screenPosition, screenSize);
  }

  #calculateRef(screenPosition, screenSize) {
    this.position = {
      x: (this.refPosition.x * screenSize.x) + screenPosition.x,
      y: (this.refPosition.y * screenSize.y) + screenPosition.y,
    };

    this.radius = (this.refRadius * screenSize.x);

    this.width = (this.refWidth * screenSize.x);
  }
}
