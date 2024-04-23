import { Screen } from "../canvasUtilitys/screen.js";
import { getCanvasSize } from "../canvasUtilitys/canvasSize.js";
import { InputManager } from "../canvasUtilitys/inputManager.js";
import { Settings } from "../settings.js";

import { Start } from "./start.js";
import { Graphics } from "./graphics.js";
import { Sound } from "./sound.js";
import { Controlls } from "./controlls.js";

export class Options extends Screen {
  static fpsLimit = 60;
  static windowMode = "fullscreen";
  static showCollisionBoxes = true;
  static showFPS = true;
  static resolution = "1280x720";
  static masterVolume = 0.9;
  static musicVolume = 0.9;
  static soundEffectVolume = 0.9;

  static init() {
    super.init({layoutPath: Settings.pathOptionsLayout, zIndex: Settings.zIndex.options});

    Graphics.init();
    Sound.init();
    Controlls.init();

    this.addElement("optionsMenu", Graphics);

    this.loadBlockButtons();

    this.fnTransitionOut = function () {
      this.refPosition.x = -this.animationTimer.progress * 0.4;
      this.resize();
      this.elements.optionsMenu.refPosition.x = this.animationTimer.progress* 0.6;
      this.elements.optionsMenu.resize();
    };
    this.fnTransitionIn = function () {
      this.refPosition.x = -0.4 + this.animationTimer.progress * 0.4;
      this.resize();
      this.elements.optionsMenu.refPosition.x = 0.6 - this.animationTimer.progress * 0.6;
      this.elements.optionsMenu.resize();
    };
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements.optionsMenu.elements.backButton.isClicked() || InputManager.isKeyPressed(27)) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Start.status = "transitionIn";
        this.elements.optionsMenu.status = "inactive";
      };
    }

    if (this.elements.optionsMenu.status !== "active") return;

    if (this.elements.buttonGraphics.isClicked() && this.elements.optionsMenu !== Graphics) this.setGraphics();
    if (this.elements.buttonSound.isClicked() && this.elements.optionsMenu !== Sound) this.setSound();
    if (this.elements.buttonControlls.isClicked() && this.elements.optionsMenu !== Controlls) this.setControlls();
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }

  static resize({screenPosition = { x: 0, y: 0 }, screenSize = getCanvasSize()} = {}) {
    super.resize();

    Graphics.resize();
    Sound.resize();
    Controlls.resize();
  }

  static setGraphics() {
    this.elements.optionsMenu.status = "transitionOut";
    this.elements.optionsMenu.fnAfterTransitionOut = () => {
      this.addElement("optionsMenu", Graphics);
      Graphics.status = "transitionIn";
    };

    this.elements.buttonGraphicsBlocked.visible = true;
    this.elements.buttonGraphicsBlockedText.visible = true;

    this.elements.buttonSoundBlocked.visible = false;
    this.elements.buttonSoundBlockedText.visible = false;
    this.elements.buttonControllsBlocked.visible = false;
    this.elements.buttonControllsBlockedText.visible = false;
  }

  static setSound() {
    this.elements.optionsMenu.status = "transitionOut";
    this.elements.optionsMenu.fnAfterTransitionOut = () => {
      this.addElement("optionsMenu", Sound);
      Sound.status = "transitionIn";
    };

    this.elements.buttonSoundBlocked.visible = true;
    this.elements.buttonSoundBlockedText.visible = true
    ;
    this.elements.buttonGraphicsBlocked.visible = false;
    this.elements.buttonGraphicsBlockedText.visible = false;
    this.elements.buttonControllsBlocked.visible = false;
    this.elements.buttonControllsBlockedText.visible = false;
  }

  static setControlls() {
    this.elements.optionsMenu.status = "transitionOut";
    this.elements.optionsMenu.fnAfterTransitionOut = () => {
      this.addElement("optionsMenu", Controlls);
      Controlls.status = "transitionIn";
    };

    this.elements.buttonControllsBlocked.visible = true;
    this.elements.buttonControllsBlockedText.visible = true;

    this.elements.buttonGraphicsBlocked.visible = false;
    this.elements.buttonGraphicsBlockedText.visible = false;
    this.elements.buttonSoundBlocked.visible = false;
    this.elements.buttonSoundBlockedText.visible = false;
  }

  static async loadBlockButtons() {
    this.buttonGraphicsBlocked = await this.getElement("buttonGraphicsBlocked");
    this.buttonGraphicsBlockedText = await this.getElement("buttonGraphicsBlockedText");

    this.buttonSoundBlocked = await this.getElement("buttonSoundBlocked");
    this.buttonSoundBlockedText = await this.getElement("buttonSoundBlockedText");

    this.buttonControllsBlocked = await this.getElement("buttonControllsBlocked");
    this.buttonControllsBlockedText = await this.getElement("buttonControllsBlockedText");

    this.elements.buttonGraphicsBlocked.visible = true;
    this.elements.buttonGraphicsBlockedText.visible = true;

    this.elements.buttonSoundBlocked.visible = false;
    this.elements.buttonSoundBlockedText.visible = false;
    this.elements.buttonControllsBlocked.visible = false;
    this.elements.buttonControllsBlockedText.visible = false;

    Sound.refPosition.x = 0.6;
    Sound.resize();

    Controlls.refPosition.x = 0.6;
    Controlls.resize();
  }
}
