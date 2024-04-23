import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";
import { InputManager } from "../canvasUtilitys/inputManager.js";
import { PageStatus } from "../canvasUtilitys/pageStatus.js";

import { Background } from "./background.js";
import { Game } from "./game.js";
import { InGame } from "./inGame.js";
import { Start } from "./start.js";
import { GrayFilter } from "./grayFilter.js";

export class InGameMenu extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathInGameMenuLayout, zIndex: Settings.zIndex.options});

    this.fnTransitionOut = function () {
      this.refPosition.x = -this.animationTimer.progress * 0.4;
      this.resize();
    };
    this.fnTransitionIn = function () {
      this.refPosition.x = -0.4 + this.animationTimer.progress * 0.4;
      this.resize();
    };
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements.resumeButton.isClicked()) {
      this.status = "transitionOut";
      GrayFilter.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Background.status = "active";
        InGame.status = "active";
        Game.status = "active";
        PageStatus.wasHidden = false;
      };
    }

    if (this.elements.restartButton.isClicked()) {
      this.status = "transitionOut";
      GrayFilter.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Background.status = "active";
        InGame.status = "active";
        Game.status = "active";
        Game.restart = true;
        PageStatus.wasHidden = false;
      };
    }

    if (this.elements.exitButton.isClicked() || InputManager.isKeyPressed(27)) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Background.status = "active";
        Start.status = "transitionIn";
        InGame.status = "inactive";
        Game.status = "inactive";
        Game.restart = true;
      };  
    }
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
