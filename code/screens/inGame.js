import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";
import { InputManager } from "../canvasUtilitys/inputManager.js";
import { PageStatus } from "../canvasUtilitys/pageStatus.js";

import { Background } from "./background.js";
import { Game } from "./game.js";
import { InGameMenu } from "./inGameMenu.js";
import { GrayFilter } from "./grayFilter.js";

export class InGame extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathInGameLayout, zIndex: Settings.zIndex.inGame});

    this.fnTransitionOut = function () {
      this.refPosition.y = -this.animationTimer.progress * 0.2;
      this.resize();
    };
    this.fnTransitionIn = function () {
      this.refPosition.y = -0.2 + this.animationTimer.progress * 0.2;
    this.resize();
    };
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements.pauseButton.isClicked() || InputManager.isKeyReleased(27) || PageStatus.wasHidden) {
      GrayFilter.status = "transitionIn";
      Background.status = "frozen";
      Game.status = "frozen";
      InGameMenu.status = "transitionIn";
      PageStatus.wasHidden = false;
      this.status = "frozen";
    }
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
