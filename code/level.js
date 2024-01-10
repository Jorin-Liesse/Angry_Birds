import { Slingshot } from "./slingshot.js";
import { Player } from "./player.js";

export class Level {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.clickedBack = false;

    this.slingshot = new Slingshot(
      {x: this.canvas.width * 0.177, y: this.canvas.height * 0.407},
      {x: this.canvas.width * 0.089, y: this.canvas.height * 0.259},
      this.canvas.width * 0.15);

    this.player = new Player();
  }

  update(dt, inputs) {
    if (inputs.keysPressed[27]) {
      this.clickedBack = true;
    }

    this.slingshot.update(dt, inputs);
    this.player.update(dt, inputs);

    this.player.slingshot = this.slingshot;
    this.player.update(dt, inputs);
  }

  draw() {
    this.player.draw();
    this.slingshot.draw();
  }
}
