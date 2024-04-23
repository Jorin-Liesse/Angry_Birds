export class AudioManager {
  static #masterVolume = 1;
  static #musicVolume = 1;
  static #soundEffectVolume = 1;

  static #sounds = {};

  static createSoundEffect(name, path, loop = false) {
    const sound = new Audio(path);
    sound.volume = this.#masterVolume * this.#soundEffectVolume;
    sound.loop = loop;

    this.#sounds[name] = {sound: sound, type: "soundEffect"};
  }

  static createMusic(name, path, loop = true) {
    const soundtrack = new Audio(path);
    soundtrack.volume = this.#masterVolume * this.#musicVolume;
    soundtrack.loop = loop;

    this.#sounds[name] = {sound: soundtrack, type: "music"};
  }

  static play(soundName) {
    this.#sounds[soundName].sound.play();
  }

  static pause(soundName) {
    this.#sounds[soundName].sound.pause();
  }

  static stop(soundName) {
    this.#sounds[soundName].sound.pause();
    this.#sounds[soundName].currentTime = 0;
  }

  static update({masterVolume = this.#masterVolume, musicVolume = this.#musicVolume, soundEffectVolume = this.#soundEffectVolume} = {}) {
    this.#masterVolume = masterVolume;
    this.#musicVolume = musicVolume;
    this.#soundEffectVolume = soundEffectVolume;

    for (const sound in this.#sounds) {
      switch (this.#sounds[sound].type) {
        case "soundEffect":
          this.#sounds[sound].sound.volume = this.#masterVolume * this.#soundEffectVolume;
          break;
        case "music":
          this.#sounds[sound].sound.volume = this.#masterVolume * this.#musicVolume;
          break;
      }
    }
  }

  static stopAll() {
    for (const sound in this.#sounds) {
      this.#sounds[sound].sound.pause();
      this.#sounds[sound].sound.currentTime = 0;
    }
  }

  static pauseAll() {
    for (const sound in this.#sounds) {
      this.#sounds[sound].sound.pause();
    }
  } 

  static playAll() {
    for (const sound in this.#sounds) {
      this.#sounds[sound].sound.play();
    }
  }
}
