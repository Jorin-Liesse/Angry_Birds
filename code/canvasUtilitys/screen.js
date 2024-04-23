import { Line } from "./UI/line.js";
import { Circle } from "./UI/circle.js";
import { Rectangle } from "./UI/rectangle.js";
import { Sprite } from "./UI/sprite.js";
import { Text } from "./UI/text.js";
import { Button } from "./UI/button.js";
import { ChoiceBox } from "./UI/choiceBox.js";
import { Slider } from "./UI/slider.js";
import { Switch } from "./UI/switch.js";
import { ProgressBar } from "./UI/progressBar.js";
import { SpriteSheet } from "./UI/spriteSheet.js";
import { Parallax } from "./UI/parallax.js";

import { getCanvasSize } from "./canvasSize.js";
import { AnimationTimer } from "./animationTimer.js";

export class Screen {
  static init({
    layoutPath = "",
    refPosition = { x: 0, y: 0 },
    refSize = { x: 1, y: 1 },
    zIndex = 0,
    screenPosition = { x: 0, y: 0 },
    screenSize = getCanvasSize(),
    status = "inactive",
    transitionDuration = 200,
  } = {}) {
    this.refPosition = refPosition;
    this.refSize = refSize;
    this.zIndex = zIndex;
    this.screenPosition = screenPosition;
    this.screenSize = screenSize;
    this.status = status;
    this.transitionDuration = transitionDuration;

    this.fnAfterTransitionIn = function () {};
    this.fnAfterTransitionOut = function () {};
    this.fnTransitionIn = function () {};
    this.fnTransitionOut = function () {};

    this.isTransitionIn = false;
    this.isTransitionOut = false;
    this.active = true;
    this.frozen = false;
    this.preActive = true;
    this.preFrozen = false;
    this.isLoaded = false;
    this.elements = {};

    this.animationTimer = new AnimationTimer(this.transitionDuration);
    this.calculateRef(screenPosition, screenSize);
    this.loadPromise = this.loadUI(layoutPath);
  }

  static checkUpdateNeeded() {
    const changeActive = this.active !== this.preActive;
    const changeFrozen = this.frozen !== this.preFrozen;

    this.change = changeActive || changeFrozen;

    this.preActive = this.active;
    this.preFrozen = this.frozen;

    if (!this.change) {
      if (this.frozen || !this.active) return false;
    }

    if (!this.isLoaded) return false;

    return true;
  }

  static update() {
    this.checkStatus();
    this.transitionIn();
    this.transitionOut();

    if (!this.checkUpdateNeeded()) return;
    for (const element in this.elements) {
      // try {
        this.elements[element].update();
      // } catch (error) {}
    }
  }

  static checkDrawNeeded() {
    if (!this.isLoaded || !this.active) return false;
    return true;
  }

  static draw() {
    if (!this.checkDrawNeeded()) return;
    for (const element in this.elements) {
      // try {
        this.elements[element].draw();
      // } catch (error) {}
    }
  }

  static resize({screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize()} = {}) {
    this.screenPosition = screenPosition;
    this.screenSize = screenSize;

    this.calculateRef(screenPosition, screenSize);

    for (const element in this.elements) {
      this.elements[element].resize(this.position, this.size);
    }
  }

  static async addElement(name, element) {
    this.elements[name] = element;

    await this.loadPromise;
    this.putElementOnTop(name);
  }

  static async removeElement(name) {
    await this.loadPromise;
    delete this.elements[name];
  }

  static async getElement(name) {
    await this.loadPromise;
    return this.elements[name];
  }

  static async putElementOnTop(elementName) {
    await this.loadPromise;

    const element = this.elements[elementName];
    delete this.elements[elementName];
    this.elements[elementName] = element;
  }

  static async loadUI(layoutPath) {
    if (layoutPath === "") {
      this.isLoaded = true;
      return;
    }

    try {
      const response = await fetch(layoutPath);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      for (const element in data) {
        switch (data[element].type) {
          case "Line":
            this.elements[element] = new Line({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Circle":
            this.elements[element] = new Circle({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Rectangle":
            this.elements[element] = new Rectangle({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Sprite":
            this.elements[element] = new Sprite({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Text":
            this.elements[element] = new Text({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Button":
            this.elements[element] = new Button({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "ChoiceBox":
            this.elements[element] = new ChoiceBox({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Slider":
            this.elements[element] = new Slider({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "Switch":
            this.elements[element] = new Switch({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "ProgressBar":
            this.elements[element] = new ProgressBar({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

          case "SpriteSheet":
            this.elements[element] = new SpriteSheet({data: data[element], screenPosition: this.position, screenSize: this.size});
            break;

            case "Parallax":
              this.elements[element] = new Parallax({data: data[element], screenPosition: this.position, screenSize: this.size});
              break;
        }
      }
      
      this.isLoaded = true;
      
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  }

  static calculateRef(screenPosition, screenSize) {
    this.position = {
      x: this.refPosition.x * screenSize.x + screenPosition.x,
      y: this.refPosition.y * screenSize.y + screenPosition.y,
    };

    this.size = {
      x: this.refSize.x * screenSize.x,
      y: this.refSize.y * screenSize.y,
    };
  }

  static transitionIn() {
    if (!this.isTransitionIn || this.animationTimer.finished) return;

    this.animationTimer.update();
    this.fnTransitionIn();

    if (this.animationTimer.progress === 1) {
      this.status = "active";
      this.fnAfterTransitionIn();
      this.isTransitionIn = false;
    }
  }

  static transitionOut() {
    if (!this.isTransitionOut || this.animationTimer.finished) return;
    this.animationTimer.update();
    this.fnTransitionOut();

    if (this.animationTimer.progress === 1) {
      this.status = "inactive";
      this.fnAfterTransitionOut();
      this.isTransitionOut = false;
    }
  }

  static checkStatus() {
    switch (this.status) {
      case "active":
        this.active = true;
        this.frozen = false;
        break;
      case "inactive":
        this.active = false;
        this.frozen = false;
        break;
      case "frozen":
        this.active = true;
        this.frozen = true;
        break;
      case "transitionIn":
        this.isTransitionIn = true;
        this.animationTimer.start();
        this.status = "frozen";
        break;
      case "transitionOut":
        this.isTransitionOut = true;
        this.animationTimer.start();
        this.status = "frozen";
        break;
    }
  }
}
