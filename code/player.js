import { Sprite } from "./UI.js";

export class Player {
  SPEED = 0.25;
  GRAVITY = 10;

  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.slingshot = null;

    this.timer = 0;

    this.position = {x: this.canvas.width * 0.177, y: this.canvas.height * 0.407};

    this.sprite = new Sprite(
      "assets/Game/BirdRed.png",
      this.position,
      {x: this.canvas.width * 0.078, y: this.canvas.height * 0.1315});
  }

  update(dt, inputs) {
    if (this.slingshot == null) return;

    const distanceIncrement = this.slingshot.lenght * this.timer * this.SPEED

    if (this.slingshot.isShot) {
      const x = (
        this.slingshot.shotPosition.x +
        (this.slingshot.force.x / this.canvas.width) * distanceIncrement
      );
      const y = (
        this.slingshot.shotPosition.y +
        (this.slingshot.force.y / this.canvas.height) * distanceIncrement +
        0.5 * this.GRAVITY * Math.pow(distanceIncrement / this.canvas.height, 2)
      );

      this.position.x = x;
      this.position.y = y;

      this.timer++;
    }

    else {
      this.position.x = this.slingshot.positionNet.x;
      this.position.y = this.slingshot.positionNet.y;
    }

    this.sprite.position.x = this.position.x;
    this.sprite.position.y = this.position.y;
  }

  draw() {
    this.sprite.draw();
  }
}
