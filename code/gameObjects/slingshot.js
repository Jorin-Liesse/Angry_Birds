import { getCanvasSize } from "../canvasUtilitys/canvasSize.js";
import { Sprite } from "../canvasUtilitys/UI/sprite.js";
import { Line } from "../canvasUtilitys/UI/line.js";
import { Circle } from "../canvasUtilitys/UI/circle.js";
import { Settings } from "../settings.js";
import { DeltaTime } from "../canvasUtilitys/deltaTime.js";
import { InputManager } from "../canvasUtilitys/inputManager.js";
import { magnitude, rotatePoint } from "../canvasUtilitys/xMath.js";

export class Slingshot {
  static init(screenPosition, screenSize) {
    this.screenPosition = {x: 0, y: 0 };
    this.screenSize = getCanvasSize();

    this.circles = []
    this.force = { x: 0, y: 0 };
    this.releasedForce = { x: 0, y: 0 };
    this.interacting = false;
    this.isReleased = false;
    this.birdLaunched = false;

    const elastic1Data = {
      startPosition: Settings.elastic1position,
      endPosition: {
        x: Settings.slingshotPosition.x + Settings.slingshotNetSize.x /2,
        y: Settings.slingshotPosition.y + Settings.slingshotNetSize.y /2
      },
      width: Settings.elasticWidth,
      color: "#ab7b69",
    }

    const elastic2Data = {
      startPosition: Settings.elastic2position,
      endPosition: {
        x: Settings.slingshotPosition.x + Settings.slingshotNetSize.x /2,
        y: Settings.slingshotPosition.y + Settings.slingshotNetSize.y /2
      },
      width: Settings.elasticWidth,
      color: "#c48b76",
    }

    const slingshotNetData = {
      path: Settings.pathSlingshotNet,
      position: Settings.slingshotPosition,
      size: Settings.slingshotNetSize,
    }

    const slingshotPoolData = {
      path: Settings.pathSlingshotpool,
      position: Settings.slingshotPosition,
      size: Settings.slingshotSize,
    }

    this.elastic1 = new Line({data: elastic1Data, screenPosition: screenPosition, screenSize: screenSize});
    this.elastic2 = new Line({data: elastic2Data, screenPosition: screenPosition, screenSize: screenSize});
    this.net = new Sprite({data: slingshotNetData, screenPosition: screenPosition, screenSize: screenSize});
    this.pool = new Sprite({data: slingshotPoolData, screenPosition: screenPosition, screenSize: screenSize});
  }

  static update() {
    this.pool.update();
    this.net.update();
    this.elastic1.update();
    this.elastic2.update();

    this.circles.forEach((circle) => {circle.update();});

    const mousePosition = InputManager.getMouseTouchPosition();

    this.targetPoint = {
      x: this.pool.position.x + this.pool.size.x / 2,
      y: this.pool.position.y + this.pool.size.y / 4
    }

    if (
      mousePosition.x > this.pool.position.x &&
      mousePosition.x < this.pool.position.x + this.pool.size.x &&
      mousePosition.y > this.pool.position.y &&
      mousePosition.y < this.pool.position.y + this.pool.size.y &&
      InputManager.isMouseTouchPressed(0) &&
      !this.isReleased
    ) {
      this.interacting = true;
    }

    if (InputManager.isMouseTouchReleased(0) && this.interacting) {
      this.interacting = false;
      this.isReleased = true;
      if (this.birdLaunched) return;
      this.releasedForce = this.getForce();
    };

    if (this.interacting) this.force = this.getForce();

    if (this.isReleased && magnitude(this.getForce()) / this.screenSize.x < 0.01) {
      this.isReleased = false;
    }

    if (this.isReleased && magnitude(this.getForce()) / this.screenSize.x < 0.04) {
      this.birdLaunched = true;
    }

    this.positingNet();

    this.createCircle();
  }

  static createCircle() {
    this.circles = [];

    if (!this.interacting || this.isReleased) return;
    const targetPoint = {
      x: this.pool.refPosition.x + this.pool.refSize.x / 2,
      y: this.pool.refPosition.y + this.pool.refSize.y / 4
    }

    let i = 0;
    while (true) {
      const x = (i * this.force.x / this.screenSize.x) + targetPoint.x;
      const y = (i * this.force.y / this.screenSize.y + Settings.gravity * (i**2)) + targetPoint.y;

      if (x < 0 || x > 1 || y > 1) {
        break;
      }

      const data = { data: 
        {
          position: { x: x, y: y },
          radius: 0.0075,
          width: 0,
          strokeColor: "transparent",
          fillColor: "#c48b76"
        },
        screenPosition: this.screenPosition,
        screenSize: this.screenSize
      }

      this.circles.push(new Circle(data));
      i += Settings.distanceIncrement / magnitude(this.force) * this.screenSize.x;
    }
  }

  static positingNet() {
    let netPosition;
    if (this.isReleased) {
      netPosition = this.returnNet();
    } 
    if (this.interacting && !this.isReleased) {
      netPosition = this.dragNet();
    }

    if (!netPosition) return;

    this.elastic1.endRefPosition = {
      x: netPosition.x / this.screenSize.x,
      y: netPosition.y / this.screenSize.y
    }
    this.elastic2.endRefPosition = {
      x: netPosition.x / this.screenSize.x,
      y: netPosition.y / this.screenSize.y
    }

    netPosition.x -= this.net.size.x /2;
    netPosition.y -= this.net.size.y /2;

    this.net.refPosition = {
      x: netPosition.x / this.screenSize.x,
      y: netPosition.y / this.screenSize.y
    }

    this.calcPlayerPosition();

    this.net.resize(this.screenPosition, this.screenSize);
    this.elastic1.resize(this.screenPosition, this.screenSize);
    this.elastic2.resize(this.screenPosition, this.screenSize);
  }

  static returnNet() {
    const netPosition = {
      x: this.net.position.x + this.net.size.x /2,
      y: this.net.position.y + this.net.size.y /2
    }

    const dx = this.targetPoint.x - netPosition.x;
    const dy = this.targetPoint.y - netPosition.y;

    netPosition.x += dx * Settings.returnNetSpeed * DeltaTime.dt;
    netPosition.y += dy * Settings.returnNetSpeed * DeltaTime.dt;

    return netPosition;
  }

  static dragNet() {
    const mousePosition = InputManager.getMouseTouchPosition();

    const netPosition = mousePosition;

    const lenght = (
      (this.targetPoint.x - netPosition.x) ** 2 +
      (this.targetPoint.y - netPosition.y) ** 2
    ) ** 0.5;

    const angle = Math.atan2(
      this.targetPoint.y - netPosition.y,
      this.targetPoint.x - netPosition.x
    );

    if (lenght > Settings.slingshotPoleRange * this.screenSize.x) {
      netPosition.x = this.targetPoint.x - Math.cos(angle) * Settings.slingshotPoleRange * this.screenSize.x;
      netPosition.y = this.targetPoint.y - Math.sin(angle) * Settings.slingshotPoleRange * this.screenSize.x;
    }

    this.net.angle = angle;

    return netPosition;
  }

  static getForce() {
    const netPosition = {
      x: this.net.position.x + this.net.size.x /2,
      y: this.net.position.y + this.net.size.y /2
    }

    const dx = this.targetPoint.x - netPosition.x;
    const dy = this.targetPoint.y - netPosition.y;

    return { x: dx, y: dy}
  }

  static calcPlayerPosition() {
    const centerPoint = {
      x: this.net.position.x + this.net.size.x / 2 ,
      y: this.net.position.y + this.net.size.y / 2
    };

    const offseted = {
      x: this.net.position.x + this.net.size.x ,
      y: this.net.position.y + this.net.size.y / 2
    };

    const newPoint = rotatePoint(centerPoint, offseted, this.net.angle);

    newPoint.x /= this.screenSize.x;
    newPoint.y /= this.screenSize.y;

    this.playerPosition = newPoint;
    this.playerRotation = this.net.angle;
  }

  static draw() {
    this.circles.forEach((circle) => {circle.draw();});

    this.elastic1.draw();
    this.elastic2.draw();
    this.net.draw();
    this.pool.draw();
  }

  static resize(screenPosition, screenSize) {
    this.pool.resize(screenPosition, screenSize);
    this.net.resize(screenPosition, screenSize);
    this.elastic1.resize(screenPosition, screenSize);
    this.elastic2.resize(screenPosition, screenSize);
  }
}
