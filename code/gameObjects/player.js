import { GameObject } from "../canvasUtilitys/gameObject.js";
import { DeltaTime } from "../canvasUtilitys/deltaTime.js";
import { rectRectCollision } from "../canvasUtilitys/collision.js";
import { Settings } from "../settings.js";
import { Slingshot } from "./slingShot.js";
import { slope } from "../canvasUtilitys/xMath.js";

export class Player extends GameObject {
  constructor(screenPosition, screenSize) {
    super({
      data: {
        path: Settings.pathPlayer,
        position: Slingshot.net.refPosition,
        size: Settings.playerSize,
        animationInfo: Settings.playerAnimationInfo,
      },
      screenPosition: screenPosition,
      screenSize: screenSize
    });

    this.collidables = [];
    this.iscollided = false;

    this.gravity = 0;
    this.i= 0;
  }

  update() {
    super.update();

    if (Slingshot.interacting || Slingshot.isReleased) {
      this.refPosition = {
        x: Slingshot.playerPosition.x - Settings.playerSize.x / 2,
        y: Slingshot.playerPosition.y - Settings.playerSize.y / 2
      }

      this.angle = Slingshot.playerRotation;
      this.resize(this.screenPosition, this.screenSize);
    }

    if (!Slingshot.birdLaunched) return;

    const targetPoint = {
      x: Slingshot.pool.refPosition.x + Slingshot.pool.refSize.x / 2,
      y: Slingshot.pool.refPosition.y + Slingshot.pool.refSize.y / 4
    }

    const oldX = this.refPosition.x;
    const oldY = this.refPosition.y;

    let x, y;
    if (!this.iscollided) {
      this.angle = slope(Settings.gravity, Slingshot.releasedForce.y / this.screenSize.y, this.i) * Math.PI;

      const vx = Slingshot.releasedForce.x / this.screenSize.x;
      const vy = Slingshot.releasedForce.y / this.screenSize.y + Settings.gravity * this.i;

      x = this.i * vx + targetPoint.x - Settings.playerSize.x / 2;
      y = this.i * vy + targetPoint.y - Settings.playerSize.y / 2;

      this.i += DeltaTime.dt * 0.005;

      this.refPosition.x = x;
      this.#collision1(this.collidables, "horizontal", oldX);
      this.refPosition.y = y;
      this.#collision1(this.collidables, "vertical", oldY);

      if (this.iscollided) this.velocity.x = vx / this.screenSize.x;
    }
    else {
      x = this.refPosition.x + this.velocity.x * 0.5 * DeltaTime.dt;
      y = this.refPosition.y + this.velocity.y * 0.5 * DeltaTime.dt;

      this.velocity.y += Settings.gravity * 0.00005 * DeltaTime.dt;

      this.refPosition.x = x;
      this.#collision2(this.collidables, "horizontal", oldX);
      this.refPosition.y = y;
      this.#collision2(this.collidables, "vertical", oldY);

      this.rotate();
    }

    this.resize(this.screenPosition, this.screenSize);
    this.setCollisionBoxesPosition();
  }

  draw() {
    super.draw();
  }

  rotate() {
    let targetAngle = Math.atan(this.velocity.y * Settings.playerRotationMultiplier);

    this.angle = this.angle + (targetAngle - this.angle) * Settings.playerRotationSmoothness;

    if (this.angle > Math.PI / 2) this.angle = Math.PI / 2;
  }

  #collision1(collidables, direction, old) {
    collidables.forEach((collidable) => {
      if (rectRectCollision(this, collidable)) {
        if (direction === "horizontal") {
          this.refPosition.x = old;
          this.velocity.x = 0;
          this.refPosition.x += collidable.velocity.x * DeltaTime.dt;
        } 
        else if (direction === "vertical") {
          this.refPosition.y = old
          this.velocity.y = 0;
          this.refPosition.y += collidable.velocity.y * DeltaTime.dt;
        }
        this.iscollided = true;
      }
    });
  }

  #collision2(collidables, direction, old) {
    collidables.forEach((collidable) => {
      if (rectRectCollision(this, collidable)) {
        if (direction === "horizontal") {
          this.refPosition.x = old;
          this.refPosition.x += collidable.velocity.x * DeltaTime.dt;
        } 
        else if (direction === "vertical") {
          this.refPosition.y = old;
          this.velocity.y = 0;
          this.refPosition.y += collidable.velocity.y * DeltaTime.dt;
          this.velocity.x -= this.velocity.x * 0.002 * DeltaTime.dt;
        }
      }
    });
  }
}
