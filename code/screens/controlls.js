import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";

export class Controlls extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathControllsLayout, status: "active"});

    this.fnTransitionOut = function () {
      this.refPosition.x = this.animationTimer.progress * 0.6;
      this.resize();
    };
    this.fnTransitionIn = function () {
      this.refPosition.x = 0.6 - this.animationTimer.progress * 0.6;
      this.resize();
    };
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
