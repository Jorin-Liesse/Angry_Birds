import { SpriteSheet } from "./UI/spriteSheet.js";
import { Rectangle } from "./UI/rectangle.js";
import { DeltaTime } from "./deltaTime.js";

export class GameObject extends SpriteSheet{
  static collisionBoxesWidth = 0.005;
  static showCollisionBoxes = false;

  constructor({ data = {}, screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize() } = {}) {
    super({data: data, screenPosition: screenPosition, screenSize: screenSize});
    this.velocity = { x: 0, y: 0 };

    this.hitTolerance = 1;

    this.screenPosition = screenPosition;
    this.screenSize = screenSize;

    this.collisionBoxes = new Rectangle({data: {
      position: data.position,
      size: {x: data.size.x * this.hitTolerance, y: data.size.y * this.hitTolerance},
      width: GameObject.collisionBoxesWidth,
      strokeColor: "blue",
      fillColor: "transparent",
      },
      screenPosition: screenPosition,
      screenSize: screenSize
    })

    this.collisionBoxes.velocity = this.velocity;
  }

  update() {
    super.update();

    if (this.velocity.x === 0 && this.velocity.y === 0) return;

    this.refPosition.x += this.velocity.x * DeltaTime.dt;
    this.refPosition.y += this.velocity.y * DeltaTime.dt;

    this.resize(this.screenPosition, this.screenSize);

    this.setCollisionBoxesPosition();
  }

  updateSpriteSheet() {
    super.update();
  }

  draw() {
    super.draw();
    if (GameObject.showCollisionBoxes) this.collisionBoxes.draw();
  }

  resize(screenPosition, screenSize) {
    super.resize(screenPosition, screenSize);
    this.collisionBoxes.resize(screenPosition, screenSize);
  }

  setCollisionBoxesPosition() {
    this.collisionBoxes.position = {
      x: this.position.x + (1 -this.hitTolerance) * this.size.x/2,
      y: this.position.y + (1- this.hitTolerance) * this.size.y/2
    };
  }
}
