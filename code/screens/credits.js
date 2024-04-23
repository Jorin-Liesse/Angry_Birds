import { Screen } from "../canvasUtilitys/screen.js";
import { InputManager } from "../canvasUtilitys/inputManager.js";
import { Start } from "./start.js";
import { Settings } from "../settings.js";

export class Credits extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathCreditsLayout, zIndex: Settings.zIndex.credits});

    this.fnTransitionOut = function () {
      this.refPosition.y = -this.animationTimer.progress;
      this.resize();
    };
    this.fnTransitionIn = function () {
      this.refPosition.y = -1 + this.animationTimer.progress;
    this.resize();
    };
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements.backButton.isClicked() || InputManager.isKeyPressed(27)) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Start.status = "transitionIn";
      };
    }

    if (this.elements.linkedinButton.isClicked()) window.open('https://www.linkedin.com/in/jorin-liesse-755774287/', '_blank');

    if (this.elements.githubButton.isClicked()) window.open('https://github.com/Jorin-Liesse/Flappy_Bird', '_blank');
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
