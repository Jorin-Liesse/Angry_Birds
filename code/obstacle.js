import { Sprite } from "./UI.js";
import { Settings } from "./settings.js";
import { rectRectCollision } from "./collision.js";

export class Obstacle {
  constructor(path, position, size) {
    this.canvas = document.getElementById("mainCanvas");

    this.relativePosition = { x: position.x / this.canvas.width, y: position.y / this.canvas.height };
    this.relativeSize = { x: size.x / this.canvas.width, y: size.y / this.canvas.height };

    this.position = position;
    this.size = size;

    this.GRAVITY = Settings.GRAVITY * 5 * Math.pow(this.canvas.width, 1.5);
    this.velocity = {x: 0, y: 0};

    this.hitTolerance = 1;

    this.player = null;
    this.ground = null;
    this.boxes = null;

    this.sprite = new Sprite(path, this.position, this.size);
  }

  update(dt, inputs) {
    if (this.player == null) return;
    if (this.ground == null) return;
    if (this.boxes == null) return;

    const collidables = [this.ground,  ...this.boxes];

      this.#movementX(dt);
      this.#collision(dt, collidables, "horizontal");
      this.#movementY(dt);
      this.#collision(dt, collidables, "vertical");
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

  draw() {
    this.sprite.draw();
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
