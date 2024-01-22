export class Level {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.clickedBack = false;
  }

  update(dt, inputs) {
    if (inputs.keysPressed[27]) {
      this.clickedBack = true;
    }
  }

  draw() {
  }
}
