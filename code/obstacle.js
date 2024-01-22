import { Sprite } from "./UI.js";

export class Obstacle {
  constructor(path, position, size) {
    this.canvas = document.getElementById("mainCanvas");
    this.position = position;
    this.size = size;

    this.sprite = new Sprite(path, this.position, this.size);
  }

  update(dt, inputs) {}

  draw() {
    this.sprite.draw();
  }
}
