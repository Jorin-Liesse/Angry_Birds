import { Screen } from "../canvasUtilitys/screen.js";
import { GameObject } from "../canvasUtilitys/gameObject.js";
import { Settings } from "../settings.js";

import { goFullScreen, exitFullScreen } from "../../script.js";

import { Options } from "./options.js";
import { FPSCounter } from "./FPSCounter.js";
import { Main } from "../main.js";

export class Graphics extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathGraphicsLayout, status: "active"});

    if (navigator.userAgent.includes('Electron')) {
      this.removeElement("choiceResolutionGray");
      this.removeElement("textResolutionGray");
    } else {
      this.removeElement("textResolution");
      this.removeElement("choiceResolution");
    }

    this.setUIValues();

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

    if (this.elements.choiceFPS.isChanged()) {
      Options.fpsLimit = parseInt(this.elements.choiceFPS.value);
      Main.save = true;
    }
    if (this.elements.choiceWindowMode.isChanged()) {
      Options.windowMode = this.elements.choiceWindowMode.value;
      this.changeWindowMode();
      Main.save = true;
    }
    
    if (navigator.userAgent.includes('Electron') && this.elements.choiceResolution.isChanged()) {
      Options.resolution = this.elements.choiceResolution.value;
      window.electronAPI.setResolution(this.elements.choiceResolution.value);
      Main.save = true;
    }
    
    if (this.elements.switchHitboxes.isChanged()) {
      Options.showCollisionBoxes = this.elements.switchHitboxes.status === "on" ? true : false;
      GameObject.showCollisionBoxes = Options.showCollisionBoxes;
      Main.save = true;
    }
    if (this.elements.switchShowFPS.isChanged()) {
      Options.showFPS = this.elements.switchShowFPS.status === "on" ? true : false;
      FPSCounter.status = Options.showFPS ? "active" : "inactive";
      Main.save = true;
    }
  }

  static changeWindowMode() {
    switch (Options.windowMode) {
      case "fullscreen":
        goFullScreen();
        break;
      case "windowed":
        exitFullScreen();
        break;
      case "borderless":
        goFullScreen();
        break;
      }
  }

  static async setUIValues() {
    await this.loadPromise;
    this.elements.choiceFPS.changeValue(Options.fpsLimit);
    this.elements.choiceWindowMode.changeValue(Options.windowMode);

    this.elements.switchHitboxes.status = Options.showCollisionBoxes ? "on" : "off";
    this.elements.switchShowFPS.status = Options.showFPS ? "on" : "off";

    if (navigator.userAgent.includes('Electron')) {
      this.elements.choiceResolution.changeValue(Options.resolution);
    }

    this.changeWindowMode();

    FPSCounter.status = Options.showFPS ? "active" : "inactive";

    if (navigator.userAgent.includes('Electron')) {
      window.electronAPI.setResolution(this.elements.choiceResolution.value);
    }
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
