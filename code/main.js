import { Shader, fetchShader } from "./canvasUtilitys/shader.js";
import { InputManager } from "./canvasUtilitys/inputManager.js";
import { AudioManager } from "./canvasUtilitys/audioManager.js";
import { DeltaTime } from "./canvasUtilitys/deltaTime.js";
import { AspectRatio } from "./canvasUtilitys/aspectRatio.js";
import { setCanvasSize } from "./canvasUtilitys/canvasSize.js";
import { PageStatus } from "./canvasUtilitys/pageStatus.js";
import { GameObject } from "./canvasUtilitys/gameObject.js";
import { Settings } from "./settings.js";

import { Start } from "./screens/start.js";
import { Options } from "./screens/options.js";
import { Game } from "./screens/game.js";
import { Background } from "./screens/background.js";
import { Credits } from "./screens/credits.js";
import { InGame } from "./screens/inGame.js";
import { InGameMenu } from "./screens/inGameMenu.js";
import { GameOver } from "./screens/gameOver.js";
import { FPSCounter } from "./screens/FPSCounter.js";
import { GrayFilter } from "./screens/grayFilter.js";
import { LevelSelector } from "./screens/levelSelector.js";

export class Main {
  static save;

  static async init() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.loadLocalStorage();

    const vertexShaderSource = await fetchShader('assets/shaders/CRT/vertexShader.glsl');
    const fragmentShaderSource = await fetchShader('assets/shaders/CRT/fragmentShader.glsl');

    InputManager.init();
    AspectRatio.init();
    PageStatus.init();
    Shader.init(vertexShaderSource, fragmentShaderSource);
    DeltaTime.init();

    Shader.initExtraTexture(Settings.pathScanlines, 1, 'u_scanlines');
    Shader.initExtraTexture(Settings.pathNoise, 2, 'u_noise');
    Shader.initExtraTexture(Settings.pathVignette, 3, 'u_vignette');

    setCanvasSize(this.canvas.width, this.canvas.height);

    this.screens = {};

    this.screens.backgroundScreen = Background;
    this.screens.game = Game;
    this.screens.startScreen = Start;
    this.screens.optionsScreen = Options;
    this.screens.creditsScreen = Credits;
    this.screens.inGameScreen = InGame;
    this.screens.inGameMenuScreen = InGameMenu;
    this.screens.gameOverScreen = GameOver;
    this.screens.FPSCounter = FPSCounter;
    this.screens.grayFilter = GrayFilter;
    this.screens.levelSelector = LevelSelector;

    for (const screen in this.screens) {
      this.screens[screen].init();
    }

    AudioManager.createMusic("soundtrack", "assets/audio/UI/soundtrack.mp3");

    window.addEventListener("click", () => {
      AudioManager.play("soundtrack");
    }, { once: true });

    window.addEventListener("resize", this.resize.bind(this));

    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastLogTime = performance.now();
  }

  static run(time) {
    requestAnimationFrame(this.run.bind(this));

    const elapsed = time - this.lastFrameTime;
    const elapsedSinceLog = time - this.lastLogTime;

    if (elapsed < 1000 / Options.fpsLimit) {
      return;
    }

    this.lastFrameTime = time;
    this.frameCount++;

    if (elapsedSinceLog >= 1000) {
      FPSCounter.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastLogTime = time;
    }

    this.update();
    this.draw();
  }

  static update() {
    InputManager.update();
    DeltaTime.update();
    Shader.update();

    for (const screen in this.screens) {
      this.screens[screen].update();
    }

    this.saveLocalStorage();
  }

  static draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const screenNames = Object.keys(this.screens);
    screenNames.sort((a, b) => this.screens[a].zIndex - this.screens[b].zIndex);

    for (const screenName of screenNames) {
      this.screens[screenName].draw();
    }

    Shader.draw();
  }

  static resize() {
    AspectRatio.adjust();
    Shader.resize();
    setCanvasSize(this.canvas.width, this.canvas.height);

    for (const screen in this.screens) {
      this.screens[screen].resize({ x: 0, y: 0 }, { x: this.canvas.width, y: this.canvas.height });
    }
  }

  static saveLocalStorage() {
    if (!this.save) return;

    const saveData = {
      showCollisionBoxes: Options.showCollisionBoxes,
      fpsLimit: Options.fpsLimit,
      windowMode: Options.windowMode,
      resolution: Options.resolution,
      showFPS: Options.showFPS,
      masterVolume: Options.masterVolume,
      musicVolume: Options.musicVolume,
      soundEffectVolume: Options.soundEffectVolume,
    };

    localStorage.setItem("saveData", JSON.stringify(saveData));
    this.save = false;
  }

  static loadLocalStorage() {
    const saveData = JSON.parse(localStorage.getItem("saveData"));

    if (saveData) {
      Options.fpsLimit = saveData.fpsLimit;
      Options.windowMode = saveData.windowMode;
      Options.showCollisionBoxes = saveData.showCollisionBoxes;
      GameObject.showCollisionBoxes = saveData.showCollisionBoxes;
      Options.showFPS = saveData.showFPS;
      Options.resolution = saveData.resolution;
      Options.masterVolume = saveData.masterVolume;
      Options.musicVolume = saveData.musicVolume;
      Options.soundEffectVolume = saveData.soundEffectVolume;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await Main.init();
  Main.run();
});
