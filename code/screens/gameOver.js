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

    this.stars = []

    this.loadStars();
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements.buttonRestart.isClicked()) {
      this.status = "transitionOut";
      GrayFilter.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
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

  static setStars() {
    const distructionRate = Object.values(Game.boxesObj).length / Game.amountOfBoxes;

    if (distructionRate < 0.33) {
      this.addElement("yellowStar1", this.stars[0]);
    }

    if (distructionRate < 0.66) {
      this.addElement("yellowStar2", this.stars[1]);
    }

    if (distructionRate === 0) {
      this.addElement("yellowStar3", this.stars[2]);
    }
  }

  static async loadStars() {
    await this.loadPromise;

    this.stars.push(this.elements.yellowStar1);
    this.stars.push(this.elements.yellowStar2);
    this.stars.push(this.elements.yellowStar3);

    this.removeElement("yellowStar1");
    this.removeElement("yellowStar2");
    this.removeElement("yellowStar3");
  }
}
