import { getCanvasSize } from "../canvasSize.js";

export class Sprite {
  #ctx;
  
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      path: "assets/graphics/empty.png",
      position: { x: 0.5, y: 0.5 },
      size: { x: 0.5, y: 0.5 }
    };

    data = { ...defaultData, ...data };

    const canvas = document.getElementById("mainCanvas");
    this.#ctx = canvas.getContext("2d");

    this.path = data.path;
    this.refPosition = data.position;
    this.refSize = data.size;

    this.visible = true;

    this.#loadImage();

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {}

  draw() {
    if (!this.visible) return;
    if (!this.isLoaded) return;

    this.#ctx.save();

    this.#ctx.translate(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    );

    if (this.isFlippedHorizontal) {
      this.#ctx.scale(-1, 1);
    }
    if (this.isFlippedVertical) {
      this.#ctx.scale(1, -1);
    }

    this.#ctx.rotate(this.angle);

    this.#ctx.drawImage(
      this.image,
      -this.size.x / 2,
      -this.size.y / 2,
      this.size.x,
      this.size.y
    );

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

    this.size = {
      x: (this.refSize.x * screenSize.x),
      y: (this.refSize.y * screenSize.y),
    };
  }

  #loadImage() {
    this.image = new Image();
    this.image.src = this.path;

    this.isLoaded = false;

    this.isFlippedVertical = false;
    this.isFlippedHorizontal = false;

    this.angle = 0;

    this.image.onload = () => {
      this.isLoaded = true;
    };
  }
}
