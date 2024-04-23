import { Screen } from "../canvasUtilitys/screen.js";
import { PageStatus } from "../canvasUtilitys/pageStatus.js";
import { Settings } from "../settings.js";

import { Credits } from "./credits.js";
import { Options } from "./options.js";
import { Game } from "./game.js";
import { InGame } from "./inGame.js";
import { GrayFilter } from "./grayFilter.js";
import { LevelSelector } from "./levelSelector.js";

export class Start extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathStartLayout, zIndex: Settings.zIndex.start, status: "active"});

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

    if (this.elements.infoButton.isClicked()) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Credits.status = "transitionIn";
      };
    };

    if (this.elements.buttonStart.isClicked()) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        LevelSelector.status = "transitionIn";
      };
    };
    
    if (this.elements.buttonOptions.isClicked()) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Options.status = "transitionIn";
        Options.elements.optionsMenu.status = "active"
      };
    };
    
    if (this.elements.buttonQuit.isClicked()) window.close();
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
