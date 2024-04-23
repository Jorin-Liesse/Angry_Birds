export class InputManager {
  static #inputs = {};
  static #currentInput = {};
  static #previousInput = {};

  static #canvas;

  static init() {
    this.#canvas = document.getElementById("mainCanvas");

    this.#inputs.keysPressed = {};
    for (let i = 0; i <= 255; i++) {
      this.#inputs.keysPressed[i] = false;
    }

    this.#inputs.mouseButtonsPressed = {};
    this.#inputs.mouseButtonsPressed[0] = false;
    this.#inputs.mouseButtonsPressed[1] = false;
    this.#inputs.mouseButtonsPressed[2] = false;
    this.#inputs.mousePosition = { x: 0, y: 0 };

    this.#inputs.touchPressed = false;
    this.#inputs.touchPosition = { x: 0, y: 0 };

    this.#mouseEvents();
    this.#keyboardEvents();
    this.#touchEvents();

    this.#currentInput = this.#inputs;
    this.#previousInput = this.#inputs;
  }

  static update() {
    this.#previousInput = JSON.parse(JSON.stringify(this.#currentInput));
    this.#currentInput = JSON.parse(JSON.stringify(this.#inputs));
  }

  static #mouseEvents() {
    document.addEventListener("mousedown", (event) => {
      this.#inputs.mouseButtonsPressed[event.button] = true;
    });

    document.addEventListener("mouseup", (event) => {
      this.#inputs.mouseButtonsPressed[event.button] = false;
    });

    document.addEventListener("mousemove", (event) => {
      this.#inputs.mousePosition.x =
        event.clientX - (window.innerWidth - this.#canvas.width) / 2;
      this.#inputs.mousePosition.y =
        event.clientY - (window.innerHeight - this.#canvas.height) / 2;
    });
  }

  static #keyboardEvents() {
    document.addEventListener("keydown", (event) => {
      this.#inputs.keysPressed[event.keyCode] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.#inputs.keysPressed[event.keyCode] = false;
    });
  }

  static #touchEvents() {
    document.addEventListener("touchstart", (event) => {
      this.#inputs.touchPressed = true;
      const touch = event.touches[0];
      this.#inputs.touchPosition = {
        x: touch.clientX - (window.innerWidth - this.#canvas.width) / 2,
        y: touch.clientY - (window.innerHeight - this.#canvas.height) / 2,
      };
    });

    document.addEventListener("touchmove", (event) => {
      const touch = event.touches[0];
      this.#inputs.touchPosition = {
        x: touch.clientX - (window.innerWidth - this.#canvas.width) / 2,
        y: touch.clientY - (window.innerHeight - this.#canvas.height) / 2,
      };
    });

    document.addEventListener("touchend", () => {
      this.#inputs.touchPressed = false;
    });
  }

  static isKeyPressed(keyCode) {
    return !this.#previousInput.keysPressed[keyCode] && this.#currentInput.keysPressed[keyCode];
  }

  static isKeyReleased(keyCode) {
    return this.#previousInput.keysPressed[keyCode] && !this.#currentInput.keysPressed[keyCode];
  }

  static isKeyDown(keyCode) {
    return this.#currentInput.keysPressed[keyCode];
  }

  static isKeyUp(keyCode) {
    return !this.#currentInput.keysPressed[keyCode];
  }

  static isMouseButtonPressed(button) {
    
    return (
      !this.#previousInput.mouseButtonsPressed[button] &&
      this.#currentInput.mouseButtonsPressed[button]
    );
  }

  static isMouseButtonReleased(button) {
    return (
      this.#previousInput.mouseButtonsPressed[button] &&
      !this.#currentInput.mouseButtonsPressed[button]
    );
  }

  static isMouseButtonDown(button) {
    return this.#currentInput.mouseButtonsPressed[button];
  }

  static isMouseButtonUp(button) {
    return !this.#currentInput.mouseButtonsPressed[button];
  }

  static isTouchPressed() {
    return !this.#previousInput.touchPressed && this.#currentInput.touchPressed;
  }

  static isTouchReleased() {
    return this.#previousInput.touchPressed && !this.#currentInput.touchPressed;
  }

  static isTouchDown() {
    return this.#currentInput.touchPressed;
  }

  static isTouchUp() {
    return !this.#currentInput.touchPressed;
  }

  static getMousePosition() {
    return this.#currentInput.mousePosition;
  }

  static getTouchPosition() {
    return this.#previousInput.touchPosition;
  }

  static getMouseTouchPosition() {
    return this.#currentInput.touchPressed
      ? this.#currentInput.touchPosition
      : this.#currentInput.mousePosition;
  }

  static isMouseTouchDown(button) {
    return this.#currentInput.touchPressed || this.#currentInput.mouseButtonsPressed[button];
  }

  static isMouseTouchUp(button) {
    return !this.#currentInput.touchPressed && !this.#currentInput.mouseButtonsPressed[button];
  }

  static isMouseTouchPressed(button) {
    return (
      (!this.#previousInput.touchPressed &&
      this.#currentInput.touchPressed) ||
      (!this.#previousInput.mouseButtonsPressed[button] &&
      this.#currentInput.mouseButtonsPressed[button])
    );
  }

  static isMouseTouchReleased(button) {
    return (
      (this.#previousInput.touchPressed &&
      !this.#currentInput.touchPressed) ||
      (this.#previousInput.mouseButtonsPressed[button] &&
      !this.#currentInput.mouseButtonsPressed[button])
    );
  }
}
