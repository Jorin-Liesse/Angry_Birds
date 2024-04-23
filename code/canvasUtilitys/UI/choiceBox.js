import { Sprite } from "./sprite.js";
import { Text } from "./text.js";

import { InputManager } from "../inputManager.js";
import { AudioManager } from "../audioManager.js";
import { getCanvasSize } from "../canvasSize.js";

export class ChoiceBox {
  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    const defaultData = {
      pathOpenSprite: "assets/graphics/empty.png",
      pathClosedSprite: "assets/graphics/empty.png",
      pathSound: "",
      options: ["Option 1", "Option 2", "Option 3"],
      positions: {
        signOpen: { x: 0.5, y: 0.3 },
        signClosed: { x: 0.5, y: 0.3 },
        options: [
          { x: 0.5, y: 0.3 },
          { x: 0.6, y: 0.3 },
          { x: 0.6, y: 0.3 }
        ]
      },

      sizes: {
        signOpen: { x: 0.2, y: 0.2 },
        signClosed: { x: 0.2, y: 0.2 }
      },
      sizeText: 0.01,
      font: "Arial",
      color: "#000000",
      alwaysOpen: false
    };

    data = { ...defaultData, ...data };

    this.refPositions = data.positions;
    this.refSizes = data.sizes;
    this.refSizeText = data.sizeText;

    this.data = data;
    this.screenPosition = screenPosition;
    this.screenSize = screenSize;

    this.alwaysOpen = data.alwaysOpen;
    this.previousValue = data.options[0];
    this.value = data.options[0];

    this.status = "closed";
    this.previousStatus = "closed";
    this.visible = true;

    this.active = true;

    this.#loadSprites(data, screenPosition, screenSize);
    this.#loadTexts(data, screenPosition, screenSize);

    AudioManager.createSoundEffect("sound", data.pathSound);

    this.#calculateRef(screenPosition, screenSize);
  }

  update() {
    if (!this.active) return;
    const mousePosition = InputManager.getMouseTouchPosition();

    const closedBounds = mousePosition.x > this.positions.signClosed.x &&
      mousePosition.x < this.positions.signClosed.x + this.sizes.signClosed.x &&
      mousePosition.y > this.positions.signClosed.y &&
      mousePosition.y < this.positions.signClosed.y + this.sizes.signClosed.y

    const openBounds = mousePosition.x > this.positions.signOpen.x &&
      mousePosition.x < this.positions.signOpen.x + this.sizes.signOpen.x &&
      mousePosition.y > this.positions.signOpen.y &&
      mousePosition.y < this.positions.signOpen.y + this.sizes.signOpen.y

    if (InputManager.isMouseTouchReleased(0) && closedBounds && this.status === "closed") {
      AudioManager.play("sound");
      this.status = "open";
    } 
    
    else if ((!(openBounds && InputManager.isMouseTouchReleased(0)) || closedBounds) && InputManager.isMouseTouchReleased(0) && this.status === "open") {
      if (!this.alwaysOpen) AudioManager.play("sound");
      this.status = this.alwaysOpen ? "open" : "closed";
    }

    else this.status = "open";

    if (this.status === "open") {
      for (let i = 1; i < this.optionsTexts.length; i++) {
        const optionBounds = mousePosition.x > this.optionsTexts[i].position.x - this.optionsTexts[i].width /2 &&
          mousePosition.x < this.optionsTexts[i].position.x + this.optionsTexts[i].width /2 &&
          mousePosition.y > this.optionsTexts[i].position.y - this.optionsTexts[i].height /2 &&
          mousePosition.y < this.optionsTexts[i].position.y + this.optionsTexts[i].height /2;

        if (InputManager.isMouseTouchReleased(0) && optionBounds) {
          AudioManager.play("sound");
          this.data.options = [this.data.options[i], ...this.data.options.filter((item) => item !== this.data.options[i])];
          this.optionsTexts = [this.optionsTexts[i], ...this.optionsTexts.filter((item) => item !== this.optionsTexts[i])];
          this.#loadTexts(this.data, this.screenPosition, this.screenSize);

          this.status = this.alwaysOpen ? "open" : "closed";
          this.value = this.data.options[0];
        }
      }
    }
  }

  draw() {
    if (!this.visible) return;
    if (this.status === "closed") {
      this.spriteClosed.draw();
      this.optionsTexts[0].draw();
    } else {
      this.spriteOpen.draw();
      this.optionsTexts.forEach((option) => option.draw());
    }
  }

  isChanged() {
    const changed = this.previousValue !== this.value;
    this.previousValue = this.value;
    return changed;
  }

  changeValue(value) {
    this.value = value;

    const i = this.data.options.indexOf(value.toString());

    this.data.options = [this.data.options[i], ...this.data.options.filter((item) => item !== this.data.options[i])];
    this.optionsTexts = [this.optionsTexts[i], ...this.optionsTexts.filter((item) => item !== this.optionsTexts[i])];
    this.#loadTexts(this.data, this.screenPosition, this.screenSize);
  }

  resize(screenPosition, screenSize) {
    this.screenPosition = screenPosition;
    this.screenSize = screenSize;

    this.#calculateRef(screenPosition, screenSize);

    this.spriteOpen.resize(screenPosition, screenSize);
    this.spriteClosed.resize(screenPosition, screenSize);

    this.optionsTexts.forEach((option) => option.resize(screenPosition, screenSize));
  }

  #loadSprites(data, screenPosition, screenSize) {
    const spriteOpenData = {
      path: data.pathOpenSprite,
      position: this.refPositions.signOpen,
      size: this.refSizes.signOpen
    };

    const spriteClosedData = {
      path: data.pathClosedSprite,
      position: this.refPositions.signClosed,
      size: this.refSizes.signClosed
    };

    this.spriteOpen = new Sprite({data: spriteOpenData, screenPosition: screenPosition, screenSize: screenSize});
    this.spriteClosed = new Sprite({data: spriteClosedData, screenPosition: screenPosition, screenSize: screenSize});
  }

  #loadTexts(data, screenPosition, screenSize) {
    this.optionsTexts = [];

    this.optionsTexts = data.options.map((option, i) => {
      let textData = {
        position: this.refPositions.options[i],
        size: this.refSizeText,
        text: option,
        font: data.font,
        color: data.color,
        align: "center",
        baseLine: "bottom"
      };
    
      return new Text({data: textData, screenPosition: screenPosition, screenSize: screenSize});
    });
  }

  #calculateRef(screenPosition, screenSize) {
    this.positions = {};
    this.sizes = {};

    for (const position in this.refPositions) {
      this.positions[position] = {
        x: this.refPositions[position].x * screenSize.x + screenPosition.x,
        y: this.refPositions[position].y * screenSize.y + screenPosition.y,
      }
    }

    for (const size in this.refSizes) {
      this.sizes[size] = {
        x: this.refSizes[size].x * screenSize.x,
        y: this.refSizes[size].y * screenSize.y,
      }
    };

    this.sizeText = this.refSizeText * screenSize.x;
  }
}
