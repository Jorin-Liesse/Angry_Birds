import { getCanvasSize } from "../canvasSize.js";

export class Text {
  #ctx;

  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      position: { "x": 0.5, "y": 0.5 },
      size: 0.1,
      text: "Hello World!",
      font: "Arial",
      color: "#ffffff",
      align: "right",
      baseLine: "middle"
    };

    data = { ...defaultData, ...data };

    const canvas = document.getElementById("mainCanvas");
    this.#ctx = canvas.getContext("2d");

    this.refPosition = data.position;
    this.refSize = data.size;
    this.text = data.text;
    this.font = data.font;
    this.color = data.color;
    this.align = data.align;
    this.baseLine = data.baseLine;

    this.visible = true;

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {}

  draw() {
    if (!this.visible) return;
    this.#ctx.save();

    this.#ctx.font = `${this.size}px "${this.font}"`;
    this.#ctx.fillStyle = this.color;

    this.#ctx.textAlign = this.align;
    this.#ctx.textBaseline = this.baseLine;

    this.width = this.#ctx.measureText(this.text).width;
    this.height = parseInt(this.#ctx.font) / 2;

    this.#ctx.fillText(this.text, this.position.x, this.position.y + this.height);

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

    this.size = (this.refSize * screenSize.x);
  }
}
