import { GameObject } from "../canvasUtilitys/gameObject.js";
import { rectRectCollision } from "../canvasUtilitys/collision.js";
import { DeltaTime } from "../canvasUtilitys/deltaTime.js";
import { Settings } from "../settings.js";

export class Box extends GameObject {
  constructor(path, position, screenPosition, screenSize) {
    super({
      data: {
        path: path,
        position: position,
        size: Settings.boxSize,
        animationInfo: Settings.boxAnimationInfo,
      },
      screenPosition: screenPosition,
      screenSize: screenSize
    });

    this.collidables = [];
  }

  update() {
    super.update();

    // console.log(this.collidables);

    this.velocity.y += Settings.gravity * 0.00005 * DeltaTime.dt;

    this.refPosition.x += this.velocity.x * DeltaTime.dt;
    this.#collision(this.collidables, "horizontal");
    this.refPosition.y += this.velocity.y * DeltaTime.dt;
    this.#collision(this.collidables, "vertical");

    this.resize(this.screenPosition, this.screenSize);
  }

  draw() {
    super.draw();
  }

  resize(screenPosition, screenSize) {
    super.resize(screenPosition, screenSize);
  }

  #collision(collidables, direction) {
    collidables.forEach((collidable) => {
      if (rectRectCollision(this.collisionBoxes, collidable)) {
        if (direction === "horizontal") {
          this.refPosition.x -= this.velocity.x * DeltaTime.dt;
          this.velocity.x = 0;
          this.refPosition.x += collidable.velocity.x * DeltaTime.dt;
        } 
        else if (direction === "vertical") {
          this.refPosition.y -= this.velocity.y * DeltaTime.dt;
          this.velocity.y = 0;
          this.refPosition.y += collidable.velocity.y * DeltaTime.dt;
        }
      }
    });
  }
}
