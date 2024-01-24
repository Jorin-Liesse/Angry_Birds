import { Sprite } from "./UI.js";
import { Settings } from "./settings.js";
import { rectRectCollision } from "./collision.js";

export class Player {
  constructor(path, position, size) {
    this.canvas = document.getElementById("mainCanvas");

    this.relativePosition = { x: position.x / this.canvas.width, y: position.y / this.canvas.height };
    this.relativeSize = { x: size.x / this.canvas.width, y: size.y / this.canvas.height };

    this.GRAVITY = Settings.GRAVITY * 5 * Math.pow(this.canvas.width, 1.5);

    this.slingshot = null;
    this.ground = null;

    this.timer = 0;

    this.position = position;
    this.size = size;
    this.velocity = {x: 0, y: 0};

    this.isShot = false;

    this.hitTolerance = 0.7;

    this.sprite = new Sprite(
      path,
      this.position,
      this.size);
  }

  update(dt, inputs) {
    if (this.slingshot == null) return;
    if (this.ground == null) return;

    if (this.slingshot.isShot && !this.isShot) {
      this.isShot = true;
      this.velocity = {
        x: this.slingshot.force.x * 11,
        y: this.slingshot.force.y * 11
      };
    }

    if (this.isShot) {
      const collidables = [this.ground];

      this.#movementX(dt);
      this.#collision(dt, collidables, "horizontal");
      this.#movementY(dt);
      this.#collision(dt, collidables, "vertical");
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

  #movementX(dt) {
    this.position.x += this.velocity.x * dt;
  }

  #movementY(dt) {
    this.velocity.y += this.GRAVITY * dt;

    this.position.y += this.velocity.y * dt;
  }

  #collision(dt, collidables, direction) {
    collidables.forEach((collidable) => {
      if (rectRectCollision(this, collidable)) {
        if (direction === "horizontal") {
          this.position.x -= this.velocity.x * dt;
        } 
        else if (direction === "vertical") {
          this.position.y -= this.velocity.y * dt;
          this.velocity.y = 0;
          this.velocity.x -= this.velocity.x * 0.05;
        }
      }
    });
  }

  resize() {
    this.GRAVITY = Settings.GRAVITY * 5 * Math.pow(this.canvas.width, 1.5);

    this.position = {
      x: this.canvas.width * this.relativePosition.x,
      y: this.canvas.height * this.relativePosition.y
    };

    this.size = {
      x: this.canvas.width * this.relativeSize.x,
      y: this.canvas.height * this.relativeSize.y
    };

    this.sprite.resize();
  }
}
