import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";
import { AudioManager } from "../canvasUtilitys/audioManager.js";

import { Options } from "./options.js";
import { Main } from "../main.js";

export class Sound extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathSoundLayout, status: "active"});

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

    if (this.elements.sliderMasterVolume.isChanged()) {
      Options.masterVolume = this.elements.sliderMasterVolume.value;
      AudioManager.update({masterVolume: Options.masterVolume});
      Main.save = true;
    }
    if (this.elements.sliderMusicVolume.isChanged()) {
      Options.musicVolume = this.elements.sliderMusicVolume.value;
      AudioManager.update({musicVolume: Options.musicVolume});
      Main.save = true;
    }
    if (this.elements.sliderSoundEffectVolume.isChanged()) {
      Options.soundEffectVolume = this.elements.sliderSoundEffectVolume.value;
      AudioManager.update({soundEffectVolume: Options.soundEffectVolume});
      Main.save = true;
    }
  }

  static async setUIValues() {
    await this.loadPromise;
    this.elements.sliderMasterVolume.changeValue(Options.masterVolume);
    this.elements.sliderMusicVolume.changeValue(Options.musicVolume);
    this.elements.sliderSoundEffectVolume.changeValue(Options.soundEffectVolume);

    AudioManager.update({masterVolume: Options.masterVolume, musicVolume: Options.musicVolume, soundEffectVolume: Options.soundEffectVolume});
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }
}
