import { Sprite } from "./sprite.js";
import { InputManager } from "../inputManager.js";
import { AudioManager } from "../audioManager.js";
import { getCanvasSize } from "../canvasSize.js";

export class Switch {
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      pathOn: "assets/graphics/empty.png",
      pathOff: "assets/graphics/empty.png",
      pathSound: "",
      position: {x: 0.4675, y: 0.15 },
      size: { x: 0.075, y: 0.060 },
      value: "on"
    };

    data = { ...defaultData, ...data };

    this.refPosition = data.position;
    this.refSize = data.size;
    this.previousStatus = data.value;
    this.status = data.value;

    this.visible = true;

    this.#loadSprites(data, screenPosition, screenSize);

    AudioManager.createSoundEffect("sound", data.pathSound);

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {
    const mousePosition = InputManager.getMouseTouchPosition();

    const switchBounds =
      mousePosition.x > this.position.x &&
      mousePosition.x < this.position.x + this.size.x &&
      mousePosition.y > this.position.y &&
      mousePosition.y < this.position.y + this.size.y;

    if (switchBounds && InputManager.isMouseTouchPressed(0)) {
      this.status = this.status === "off" ? "on" : "off";
      AudioManager.play("sound");
    }
  }

  draw() {
    if (!this.visible) return;
    if (this.status === "on") {
      this.spriteOn.draw();
    } else {
      this.spriteOff.draw();
    }
  }

  isChanged() {
    const changed = this.previousStatus !== this.status;
    this.previousStatus = this.status;
    return changed;
  }

  resize(screenPosition, screenSize) {
    this.#calculateRef(screenPosition, screenSize);

    this.spriteOn.resize(screenPosition, screenSize);
    this.spriteOff.resize(screenPosition, screenSize);
  }

  #loadSprites(data, screenPosition, screenSize) {
    const spriteOnData = {
      path: data.pathOn,
      position: this.refPosition,
      size: this.refSize
    };

    const spriteOffData = {
      path: data.pathOff,
      position: this.refPosition,
      size: this.refSize
    };

    this.spriteOn = new Sprite({data: spriteOnData, screenPosition: screenPosition, screenSize: screenSize});
    this.spriteOff = new Sprite({data: spriteOffData, screenPosition: screenPosition, screenSize: screenSize});
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
