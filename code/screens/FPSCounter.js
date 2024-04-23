import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";

export class FPSCounter extends Screen {
  static currentFPS = 0;
  static init() {
    super.init({layoutPath: Settings.pathFPSCounterLayout, zIndex: Settings.zIndex.FPSCounter, status: "active"});
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;
    this.elements.FPSCounter.text = `${this.currentFPS} FPS`;
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
