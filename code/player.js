import { Sprite } from "./UI.js";

export class Player {
  SPEED = 0.25;
  GRAVITY = 10;

  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.slingshot = null;

    this.timer = 0;

    this.position = {x: this.canvas.width * 0.177, y: this.canvas.height * 0.407};

    this.isShot = false;

    this.lenght = 0;
    this.force = {x: 0, y: 0};
    this.shotPosition = {x: 0, y: 0};

    this.sprite = new Sprite(
      "assets/Game/BirdRed.png",
      this.position,
      {x: this.canvas.width * 0.078, y: this.canvas.height * 0.1315});
  }

  update(dt, inputs) {
    if (this.slingshot == null) return;

    if (this.slingshot.isShot && !this.isShot) {
      this.lenght = this.slingshot.lenght;
      this.force = this.slingshot.force;
      this.shotPosition = this.slingshot.shotPosition;

      this.isShot = true;
    }

    if (this.isShot) {
      const distanceIncrement = this.lenght * this.timer * this.SPEED;

      const x = (
        this.shotPosition.x +
        (this.force.x / this.canvas.width) * distanceIncrement
      );
      const y = (
        this.shotPosition.y +
        (this.force.y / this.canvas.height) * distanceIncrement +
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
