import { Screen } from "../canvasUtilitys/screen.js";
import { Settings } from "../settings.js";
import { AudioManager } from "../canvasUtilitys/audioManager.js";

import { Main } from "../main.js";
import { InGame } from "./inGame.js";
import { GameOver } from "./gameOver.js";
import { Background } from "./background.js";
import { GrayFilter } from "./grayFilter.js";

import { rectRectCollision } from "../canvasUtilitys/collision.js";
import { getCanvasSize } from "../canvasUtilitys/canvasSize.js";
import { Player } from "../gameObjects/player.js";
import { Ground } from "../gameObjects/ground.js";
import { Slingshot } from "../gameObjects/slingshot.js"; 
import { Box } from "../gameObjects/box.js";

export class Game extends Screen {
  static restart = false;
  static lost = false;
  static activeLevel = 0;
  
  static init() {
    super.init({zIndex: Settings.zIndex.game});

    AudioManager.createSoundEffect("boxBreaking", Settings.boxSound);

    this.reset();
  }

  static update() {
    super.update();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements["player"].refPosition.x + this.elements["player"].refSize.x < 0) {
      this.lost = true;
      this.elements["player"].refPosition.x = 2;
    };

    for (const boxStr in this.boxesObj) {
      if (rectRectCollision(this.boxesObj[boxStr].collisionBoxes, this.elements["player"])) {
        delete this.boxesObj[boxStr];
        delete this.elements[boxStr];
        AudioManager.play("boxBreaking");

        for (const boxKey in this.boxesObj) {
          const box = this.boxesObj[boxKey];
          box.collidables = Object.values(this.boxesObj).filter((b) => b !== box);
          box.collidables.push(this.elements.ground.collisionBoxes);
        }
      }
    }

    if (this.lost) {
      this.status = "frozen";
      GrayFilter.status = "transitionIn";
      InGame.status = "frozen";
      Background.status = "frozen";
      GameOver.status = "transitionIn";
      Main.save = true;
    }

    if (this.restart) this.reset();
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }

  static async reset() {
    await this.loadLevelsData();

    this.elements = {};

    Slingshot.init();

    this.addElement("ground", new Ground({ x: 0, y: 0 }, getCanvasSize()));
    this.addElement("player", new Player({ x: 0, y: 0 }, getCanvasSize()));
    this.addElement("slingshot", Slingshot);

    this.elements["player"].collidables = [this.elements["ground"].collisionBoxes];

    this.loadLevel("level" + this.activeLevel);

    this.restart = false;
  }

  static loadLevel(levelKey) {
    this.boxesObj = {};
    for (const element in this.levels[levelKey]) {
      const data = this.levels[levelKey][element];
      switch (data.type) {
        case "Box":
            this.addElement(element, new Box(data.path, data.position, this.screenPosition, this.screenSize));
            this.boxesObj[element] = this.elements[element];
          break;
        default:
          break;
      }
    }

    for (const boxKey in this.boxesObj) {
      const box = this.boxesObj[boxKey];
      box.collidables = Object.values(this.boxesObj).filter((b) => b !== box);
      box.collidables.push(this.elements.ground.collisionBoxes);
    }
  }

  static async loadLevelsData() {
    await fetch(Settings.pathLevels)
      .then(response => response.json())
      .then(data => {
        this.levels = data;
      });
  }
}
