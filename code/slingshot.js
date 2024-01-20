import { Line, Circle, Sprite } from "./UI.js";

export class Slingshot {
  GRAVITY = 10;
  DISTANCEINCREMENT = 500;
  NETRETURNSPEED = 30;

  constructor(position, size, range) {
    this.canvas = document.getElementById("mainCanvas");

    this.position = position;
    this.size = size;
    this.range = range;

    this.positionNet = { x: this.position.x, y: this.position.y };
    this.sizeNet = { x: this.size.x * 0.5, y: this.size.y * 0.5 };

    this.interacting = false;
    this.isShot = false;

    this.lenght = 0;
    this.force = { x: 0, y: 0 };
    this.shotPosition = { x: 0, y: 0 };

    this.previousMouseButtonsPressed = false;

    this.SlingshotPool = new Sprite(
      "assets/Game/SlingshotPool.png",
      this.position,
      this.size
    );
    this.SlingshotNet = new Sprite(
      "assets/Game/SlingshotNet.png",
      this.positionNet,
      this.sizeNet
    );

    this.elastic1 = new Line(
      {
        x: this.position.x + this.canvas.width * 0.0703,
        y: this.position.y + this.canvas.height * 0.0278,
      },
      { x: this.position.x, y: this.position.y },
      this.canvas.width * 0.02,
      "#ab7b69"
    );

    this.elastic2 = new Line(
      {
        x: this.position.x + this.canvas.width * 0.0156,
        y: this.position.y + this.canvas.height * 0.0278,
      },
      { x: this.position.x, y: this.position.y },
      this.canvas.width * 0.02,
      "#c48b76"
    );

    this.circles = [];
  }

  update(dt, inputs) {
    this.circles = [];

    if (
      inputs.mousePosition.x > this.position.x &&
      inputs.mousePosition.x < this.position.x + this.size.x &&
      inputs.mousePosition.y > this.position.y &&
      inputs.mousePosition.y < this.position.y + this.size.y &&
      inputs.mouseButtonsPressed[0]
    ) {
      this.interacting = true;
    }

    if (!inputs.mouseButtonsPressed[0]) {
      this.interacting = false;
    }

    if (this.isShot) {
      this.interacting = false;
      this.isShot = false;
      this.timer = 0;
    }

    if (this.previousMouseButtonsPressed && !inputs.mouseButtonsPressed[0]) {
      this.isShot = true;
    }

    if (this.interacting) {
      this.positionNet.x = inputs.mousePosition.x - this.sizeNet.x / 2;
      this.positionNet.y = inputs.mousePosition.y - this.sizeNet.y / 2;

      this.lenght = Math.sqrt(
        Math.pow(this.position.x - this.positionNet.x, 2) +
        Math.pow(this.position.y - this.positionNet.y, 2)
      );
      const angle = Math.atan2(
        this.position.y - this.positionNet.y,
        this.position.x - this.positionNet.x
      );

      if (this.lenght > this.range) {
        this.positionNet.x = this.position.x - Math.cos(angle) * this.range;
        this.positionNet.y = this.position.y - Math.sin(angle) * this.range;
      }

      this.lenght = Math.sqrt(
        Math.pow(this.position.x - this.positionNet.x, 2) +
        Math.pow(this.position.y - this.positionNet.y, 2)
      );

      this.force = {
        x: this.lenght * Math.cos(angle),
        y: this.lenght * Math.sin(angle),
      };

      this.shotPosition = {x: this.positionNet.x, y: this.positionNet.y};

      let i = 0;
      while (true) {
        const x = (
          this.positionNet.x +
          this.sizeNet.x / 2 +
          (this.force.x / this.canvas.width) * i * this.DISTANCEINCREMENT
        );
        const y = (
          this.positionNet.y +
          this.sizeNet.y / 2 +
          (this.force.y / this.canvas.height) * i * this.DISTANCEINCREMENT +
          0.5 * this.GRAVITY * Math.pow(i * this.DISTANCEINCREMENT / this.canvas.height, 2)
        );

        if (x < 0 || x > this.canvas.width || y > this.canvas.height) {
          break;
        }

        this.circles.push(new Circle({ x: x, y: y }, this.canvas.width * 0.0075, "red"));
        i++;
      }
    } 
    
    else {
      const dx = this.position.x - this.positionNet.x;
      const dy = this.position.y - this.positionNet.y;

      this.positionNet.x += dx * this.NETRETURNSPEED * dt;
      this.positionNet.y += dy * this.NETRETURNSPEED * dt;
    }

    this.SlingshotNet.angle = Math.atan2(
      this.position.y - this.positionNet.y,
      this.position.x - this.positionNet.x
    );

    this.elastic1.endPosition = {
      x: this.positionNet.x + this.sizeNet.x / 2,
      y: this.positionNet.y + this.sizeNet.y / 2,
    };
    this.elastic2.endPosition = {
      x: this.positionNet.x + this.sizeNet.x / 2,
      y: this.positionNet.y + this.sizeNet.y / 2,
    };

    this.previousMouseButtonsPressed = inputs.mouseButtonsPressed[0];
  }

  draw() {
    this.circles.forEach((circle) => {
      circle.draw();
    });

    this.elastic1.draw();
    this.elastic2.draw();

    this.SlingshotNet.draw();
    this.SlingshotPool.draw();
  }
}
