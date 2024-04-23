import { getCanvasSize } from "../canvasSize.js";

export class Line {
  #ctx;
  
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      startPosition: { x: 0, y: 0 },
      endPosition: { x: 1, y: 1 },
      width: 0.01,
      color: "#ffffff"
    };

    data = { ...defaultData, ...data };

    const canvas = document.getElementById("mainCanvas");
    this.#ctx = canvas.getContext("2d");

    this.startRefPosition = data.startPosition;
    this.endRefPosition = data.endPosition;
    this.refWidth = data.width;
    this.color = data.color;

    this.visible = true;

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {}

  draw() {
    if (!this.visible) return;
    this.#ctx.save();
    this.#ctx.strokeStyle = this.color;
    this.#ctx.lineWidth = this.width;

    this.#ctx.beginPath();
    this.#ctx.moveTo(this.startPosition.x, this.startPosition.y);
    this.#ctx.lineTo(this.endPosition.x, this.endPosition.y);
    this.#ctx.stroke();

    this.#ctx.restore();
  }

  resize(screenPosition, screenSize) {
    this.#calculateRef(screenPosition, screenSize);
  }

  #calculateRef(screenPosition, screenSize) {
    this.startPosition = {
      x: (this.startRefPosition.x * screenSize.x) + screenPosition.x,
      y: (this.startRefPosition.y * screenSize.y) + screenPosition.y,
    };

    this.endPosition = {
      x: (this.endRefPosition.x * screenSize.x) + screenPosition.x,
      y: (this.endRefPosition.y * screenSize.y) + screenPosition.y,
    };

    this.width = (this.refWidth * screenSize.x);
  }
}
