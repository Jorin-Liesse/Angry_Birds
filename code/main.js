import { Background } from "./background.js";
import { Level } from "./level.js";
import { Menu } from "./menu.js";

class Main {
  #timeLastFrame = 0;
  #timeThisFrame = 0;

  #inputs = {};

  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.#adjustAspectRatio();

    this.#events();

    this.active = "menu"; // level, menu

    this.level = new Level();
    this.menu = new Menu();
  }

  run() {
    this.#update();
    this.#draw();

    requestAnimationFrame(this.run.bind(this));
  }

  #update() {
    this.#deltaTime();

    switch (this.active) {
      case "menu":
        this.menu.update(this.dt, this.#inputs);

        if (this.menu.clickedStart) {
          this.active = "level";
          this.menu.clickedStart = false;
        }
        break;
      case "level":
        this.level.update(this.dt, this.#inputs);
        if (this.level.clickedBack) {
          this.active = "menu";
          this.level.clickedBack = false;
        }
        break;
    }
  }

  #draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.active) {
      case "menu":
        this.menu.draw();
        break;
      case "level":
        this.level.draw();
        break;
    }
  }

  #deltaTime() {
    this.#timeThisFrame = performance.now();
    this.dt = (this.#timeThisFrame - this.#timeLastFrame) / 1000;
    this.#timeLastFrame = this.#timeThisFrame;
  }

  #adjustAspectRatio() {
    if ((window.innerHeight * 16) / 9 > window.innerWidth) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = (window.innerWidth * 9) / 16;
    } else {
      this.canvas.width = (window.innerHeight * 16) / 9;
      this.canvas.height = window.innerHeight;
    }
  }

  #events() {
    this.#inputs.keysPressed = {};
    this.#inputs.mouseButtonsPressed = {};
    this.#inputs.mousePosition = {};

    for (let i = 0; i <= 255; i++) {
      this.#inputs.keysPressed[i] = false;
    }

    this.#inputs.mouseButtonsPressed[0] = false;
    this.#inputs.mouseButtonsPressed[1] = false;
    this.#inputs.mouseButtonsPressed[2] = false;

    this.#inputs.mousePosition.x = 0;
    this.#inputs.mousePosition.y = 0;

    document.addEventListener("keydown", (event) => {
      this.#inputs.keysPressed[event.keyCode] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.#inputs.keysPressed[event.keyCode] = false;
    });

    document.addEventListener("mousedown", (event) => {
      this.#inputs.mouseButtonsPressed[event.button] = true;
    });

    document.addEventListener("mouseup", (event) => {
      this.#inputs.mouseButtonsPressed[event.button] = false;
    });

    document.addEventListener("mousemove", (event) => {
      this.#inputs.mousePosition.x =
        event.clientX - (window.innerWidth - this.canvas.width) / 2;
      this.#inputs.mousePosition.y =
        event.clientY - (window.innerHeight - this.canvas.height) / 2;
    });

    window.addEventListener("resize", function () {
      location.reload();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const main = new Main();
  main.run();
});
