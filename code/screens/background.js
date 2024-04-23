import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";

export class Background extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathBackgroundLayout, zIndex: Settings.zIndex.background, status: "active"});
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
