import { DeltaTime } from "../deltaTime.js";

import { getCanvasSize } from "../canvasSize.js";

export class SpriteSheet {
  #ctx;
  
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      path: "assets/graphics/empty.png",
      position: { "x": 0, "y": 0 },
      size: { "x": 0.1, "y": 0.1 },
      animationInfo: {
        "rows": 1,
        "columns": 1,
        "startFrame": 0,
        "endFrame": 0,
        "frameRate": 1
      }
    };

    data = { ...defaultData, ...data };

    const canvas = document.getElementById("mainCanvas");
    this.#ctx = canvas.getContext("2d");

    this.path = data.path;
    this.refPosition = data.position;
    this.refSize = data.size;

    this.animationInfo = data.animationInfo;

    this.currentFrame = this.animationInfo.startFrame;
    this.frameTimer = 0;
    this.visible = true;
    this.isLoaded = false;

    this.#loadImage();

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {
    this.frameTimer += DeltaTime.dt;
    if (this.frameTimer >= 1000 / this.animationInfo.frameRate) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % (this.animationInfo.endFrame + 1);
    }
  }

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

    const row = Math.floor(this.currentFrame / this.animationInfo.columns);
    const col = this.currentFrame % this.animationInfo.columns;
    const frameWidth = this.image.naturalWidth / this.animationInfo.columns;
    const frameHeight = this.image.naturalHeight / this.animationInfo.rows;


    this.#ctx.drawImage(
      this.image,
      col * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
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
    this.screenPosition = {
      x: screenPosition.x,
      y: screenPosition.y,
    };

    this.screenSize = {
      x: screenSize.x,
      y: screenSize.y,
    };

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

    this.isFlippedVertical = false;
    this.isFlippedHorizontal = false;

    this.angle = 0;

    this.image.onload = () => {
      this.isLoaded = true;
    };
  }
}
