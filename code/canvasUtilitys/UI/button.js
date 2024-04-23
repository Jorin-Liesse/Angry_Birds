import { Sprite } from "./sprite.js";
import { Text } from "./text.js";

import { getCanvasSize } from "../canvasSize.js";
import { InputManager } from "../inputManager.js";
import { AudioManager } from "../audioManager.js";

export class Button {
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      pathUpSprite: "assets/graphics/empty.png",
      pathDownSprite: "assets/graphics/empty.png",
      pathUpSound: "",
      pathDownSound: "",
      position: { x: 0, y: 0 },
      size: { x: 1, y: 1 },
      text: "",
      font: "Arial",
      color: "#000000"
    };

    data = { ...defaultData, ...data };

    this.refPosition = data.position;
    this.refSize = data.size;

    this.status = "closed";
    this.previousStatus = "closed";

    this.visible = true;

    this.clicked = false;

    this.#loadSprites(data, screenPosition, screenSize);
    this.#loadTexts(data, screenPosition, screenSize);

    AudioManager.createSoundEffect("upSound", data.pathUpSound);
    AudioManager.createSoundEffect("downSound", data.pathDownSound);

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {
    const mousePosition = InputManager.getMouseTouchPosition();
    if (
      mousePosition.x > this.position.x &&
      mousePosition.x < this.position.x + this.size.x &&
      mousePosition.y > this.position.y &&
      mousePosition.y < this.position.y + this.size.y &&
      InputManager.isMouseTouchDown(0)
    ) {
      this.status = "down";
    } else {
      this.status = "up";
    }

    if (
      InputManager.isMouseTouchDown(0) &&
      this.previousStatus === "up" &&
      this.status === "down"
    ) {
      AudioManager.play("upSound");
    }

    if (
      InputManager.isMouseTouchReleased(0) &&
      this.previousStatus === "down"
    ) {
      this.clicked = true;
      AudioManager.play("downSound");
    }

    else {
      this.clicked = false;
    }

    this.previousStatus = this.status;
  }

  draw() {
    if (!this.visible) return;
    if (this.status === "up") {
      this.spriteUp.draw();
      this.buttonTextUp.draw();
    } else {
      this.spriteDown.draw();
      this.buttonTextDown.draw();
    }
  }

  resize(screenPosition, screenSize) {
    this.#calculateRef(screenPosition, screenSize);

    this.spriteUp.refPosition = this.refPosition;
    this.spriteDown.refPosition = this.refPosition;

    this.spriteUp.refSize = this.refSize;
    this.spriteDown.refSize = this.refSize;

    this.spriteUp.resize(screenPosition, screenSize);
    this.spriteDown.resize(screenPosition, screenSize);

    this.buttonTextUp.resize(screenPosition, screenSize);
    this.buttonTextDown.resize(screenPosition, screenSize);
  }
  
  isClicked() {
    return this.clicked;
  }

  #loadSprites(data, screenPosition, screenSize) {
    const spriteUpData = {
      path: data.pathUpSprite,
      position: this.refPosition,
      size: this.refSize
    };

    const spriteDownData = {
      path: data.pathDownSprite,
      position: this.refPosition,
      size: this.refSize
    };

    this.spriteUp = new Sprite({data: spriteUpData, screenPosition: screenPosition, screenSize: screenSize});
    this.spriteDown = new Sprite({data: spriteDownData, screenPosition: screenPosition, screenSize: screenSize});
  }

  #loadTexts(data, screenPosition, screenSize) {
    const textUpData = {
      position: { x: this.refPosition.x + this.refSize.x /2, y: this.refPosition.y + this.refSize.y /2 },
      size: this.refSize.x / 4,
      text: data.text,
      font: data.font,
      color: data.color,
      align: "center",
      baseLine: "bottom"
    };

    const textDownData = {
      position: { x: this.refPosition.x + this.refSize.x /2, y: this.refPosition.y + this.refSize.y /2 + this.refSize.y / 15},
      size: this.refSize.x / 4.5,
      text: data.text,
      font: data.font,
      color: data.color,
      align: "center",
      baseLine: "bottom"
    };

    this.buttonTextUp = new Text({data: textUpData, screenPosition: screenPosition, screenSize: screenSize});
    this.buttonTextDown = new Text({data: textDownData, screenPosition: screenPosition, screenSize: screenSize});
  }

  #calculateRef(screenPosition, screenSize) {
    this.position = {
      x: this.refPosition.x * screenSize.x + screenPosition.x,
      y: this.refPosition.y * screenSize.y + screenPosition.y,
    };

    this.size = {
      x: this.refSize.x * screenSize.x,
      y: this.refSize.y * screenSize.y,
    };
  }
}
