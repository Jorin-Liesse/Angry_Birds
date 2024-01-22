import { Sprite } from "./UI.js";
import { Settings } from "./settings.js";

export class Player {
  constructor(path, position, size) {
    this.canvas = document.getElementById("mainCanvas");

    this.GRAVITY = Settings.GRAVITY * 5 * Math.pow(this.canvas.width, 1.5);

    this.slingshot = null;
    this.ground = null;

    this.timer = 0;

    this.position = position;
    this.size = size;
    this.velocity = {x: 0, y: 0};

    this.radius = this.size.x / 2;

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
      if (this.#rectRectCollision(this, collidable)) {
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

  #circleRectCollision(circle, rect) {
    const circleCenterPosition = {
      x: circle.position.x + circle.radius,
      y: circle.position.y + circle.radius,
    };

    let testX = circleCenterPosition.x;
    let testY = circleCenterPosition.y;

    if (circleCenterPosition.x < rect.position.x)
      testX = rect.position.x; // test left edge
    else if (circleCenterPosition.x > rect.position.x + rect.size.x)
      testX = rect.position.x + rect.size.x; // right edge
    if (circleCenterPosition.y < rect.position.y)
      testY = rect.position.y; // top edge
    else if (circleCenterPosition.y > rect.position.y + rect.size.y)
      testY = rect.position.y + rect.size.y; // bottom edge

    // get distance from closest edges
    let distX = circleCenterPosition.x - testX;
    let distY = circleCenterPosition.y - testY;
    let distance = Math.sqrt(distX * distX + distY * distY);

    // if the distance is less than the radius, collision!
    if (distance <= circle.radius) {
      return true;
    }
    return false;
  }

  #circleCircleCollision(circle1, circle2) {
    const distance = Math.sqrt(
      Math.pow(circle1.position.x - circle2.position.x, 2) +
      Math.pow(circle1.position.y - circle2.position.y, 2)
    );

    if (distance <= circle1.radius + circle2.radius) {
      return true;
    }
    return false;
  }

  #rectRectCollision(rect1, rect2) {
    const hitboxScale = rect1.hitTolerance;

    const scaledWidth = rect1.size.x * hitboxScale;
    const scaledHeight = rect1.size.y * hitboxScale;

    const scaledX = rect1.position.x + (rect1.size.x - scaledWidth) / 2;
    const scaledY = rect1.position.y + (rect1.size.y - scaledHeight) / 2;

    if (
        scaledX < rect2.position.x + rect2.size.x &&
        scaledX + scaledWidth > rect2.position.x &&
        scaledY < rect2.position.y + rect2.size.y &&
        scaledY + scaledHeight > rect2.position.y
    ) {
        return true;
    }
    return false;
}
}
