import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";

export class GrayFilter extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathGrayFilterLayout, zIndex: Settings.zIndex.grayFilter, status: "active"});

    this.fnTransitionOut = function () {
      this.elements.grayFilter.fillColor = `rgba(0, 0, 0, ${0.5 * (1 - this.animationTimer.progress)})`;
    };
    this.fnTransitionIn = function () {
      this.elements.grayFilter.fillColor = `rgba(0, 0, 0, ${0.5 * this.animationTimer.progress})`;
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
