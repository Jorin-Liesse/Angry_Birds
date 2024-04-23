import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";
import { InputManager } from "../canvasUtilitys/inputManager.js";
import { PageStatus } from "../canvasUtilitys/pageStatus.js";

import { InGame } from "./inGame.js";
import { Background } from "./background.js";
import { Game } from "./game.js";
import { Start } from "./start.js"; 
import { GrayFilter } from "./grayFilter.js";

export class GameOver extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathGameoverLayout, zIndex: Settings.zIndex.gameOver});

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

    this.elements.scoreNumberText.text = InGame.score;;

    if (this.elements.buttonRestart.isClicked()) {
      this.status = "transitionOut";
      GrayFilter.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        InGame.score = 0;
        InGame.status = "active";
        Game.status = "active";
        Background.status = "active";
        Game.restart = true;
        Game.lost = false;
        PageStatus.wasHidden = false;
      };
    }

    if (this.elements.buttonExit.isClicked() || InputManager.isKeyPressed(27)) {
      this.status = "transitionOut";
      InGame.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        InGame.score = 0;
        InGame.status = "inactive";
        Game.status = "inactive";
        Background.status = "active";
        Game.restart = true;
        Game.lost = false;
        Start.status = "transitionIn";
      };
    }
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
