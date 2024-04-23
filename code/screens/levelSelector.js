import { Screen } from "../canvasUtilitys/screen.js";
import { Button } from "../canvasUtilitys/UI/button.js";
import { AnimationTimer } from "../canvasUtilitys/animationTimer.js";
import { Settings } from "../settings.js";

import { Start } from "./start.js";
import { InGame } from "./inGame.js";
import { Game } from "./game.js";
import { PageStatus } from "../canvasUtilitys/pageStatus.js";
import { GrayFilter } from "./grayFilter.js";

export class LevelSelector extends Screen {
  static init() {
    super.init({layoutPath: Settings.pathLevelSelectorLayout, zIndex: Settings.zIndex.levelSelector});

    this.levelPrevieuwCenter = 1;
    this.preLevelPrevieuwCenter = 1;

    this.isTransitionLeft = false;
    this.isTransitionRight = false;

    this.previews = [];
    this.arrows = {};

    this.loadPrevieuw();

    for (let i = 0; i <= 2; i++) {
      const preview = this.previews[this.levelPrevieuwCenter + i - 1]
      preview.refPosition = Settings.previewPositions[i];

      if (i !== 1) {
        preview.refSize = {
          x: Settings.previewSize.x * 0.9,
          y: Settings.previewSize.y * 0.9
        };
  
        const center = {
          x: preview.refPosition.x + Settings.previewSize.x/2,
          y: preview.refPosition.y + Settings.previewSize.y/2
        };
  
        preview.refPosition = {
          x: center.x - preview.refSize.x/2,
          y: center.y - preview.refSize.y/2
        };
      }

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + i, preview);
    }

    this.animationTimerPreview = new AnimationTimer(this.transitionDuration * 1);

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
    this.transitionLeft();
    this.transitionRight();
    if (!this.checkUpdateNeeded()) return;

    if (this.elements.backButton.isClicked()) {
      this.status = "transitionOut";
      this.fnAfterTransitionOut = function () {
        Start.status = "transitionIn";
      };
    };

    for (let i = 0; i <= 2; i++) {
      if (this.elements["preview" + (this.levelPrevieuwCenter - 1 + i)].isClicked()) {
        this.status = "transitionOut";
        GrayFilter.status = "transitionOut";
        this.fnAfterTransitionOut = function () {
          InGame.status = "transitionIn";
          Game.status = "active";
          PageStatus.wasHidden = false;
          Game.restart = true;
          Game.activeLevel = this.levelPrevieuwCenter + i; 
          // Game.loadLevel("level" + (this.levelPrevieuwCenter + i));
        };
      }
    }

    if (this.levelPrevieuwCenter !== 1 && this.elements.leftButton.isClicked()) {
      if (this.isTransitionLeft || this.isTransitionRight) return;

      this.levelPrevieuwCenter = Math.max(1, this.levelPrevieuwCenter - 1);
      this.isTransitionRight = true;
      this.animationTimerPreview.start();

      if (this.levelPrevieuwCenter === 1) {
        this.addElement("blockLeft", this.arrows.blockLeft);
        this.removeElement("leftButton");
      } 
      if (this.levelPrevieuwCenter === Settings.amountOfLevels - 3) {
        this.removeElement("blockRight");
        this.addElement("rightButton", this.arrows.right);
      }
    };

    if (this.levelPrevieuwCenter !== Settings.amountOfLevels - 2 && this.elements.rightButton.isClicked()) {
      if (this.isTransitionLeft || this.isTransitionRight) return;

      this.levelPrevieuwCenter = Math.min(Settings.amountOfLevels - 2, this.levelPrevieuwCenter + 1);
      this.isTransitionLeft = true;
      this.animationTimerPreview.start();

      if (this.levelPrevieuwCenter === Settings.amountOfLevels - 2) {
        this.addElement("blockRight", this.arrows.blockRight);
        this.removeElement("rightButton");
      }
      if (this.levelPrevieuwCenter === 2){
        this.removeElement("blockLeft");
        this.addElement("leftButton", this.arrows.left);
      }
    };

    this.preLevelPrevieuwCenter = this.levelPrevieuwCenter;
  }

  static async loadPrevieuw() {
    for (let i = 1; i <= Settings.amountOfLevels; i++) {
      const data = {
        pathUpSprite: `assets/graphics/UI/levelPreview/up/${i}.png`,
        pathDownSprite: `assets/graphics/UI/levelPreview/down/${i}.png`,
        pathUpSound: "assets/audio/UI/buttonUp.mp3",
        pathDownSound: "assets/audio/UI/buttonDown.mp3",
        position: { x: 0, y: 0 },
        size: Settings.previewSize,
        text: "",
        font: "",
        color: ""
      }

      this.previews.push(new Button({data: data, screenPosition: this.screenPosition, screenSize: this.screenSize}));
    }

    await this.loadPromise;

    this.arrows.left = this.elements.leftButton;
    this.arrows.right = this.elements.rightButton;
    this.arrows.blockLeft = this.elements.blockLeft;
    this.arrows.blockRight = this.elements.blockRight;

    this.removeElement("leftButton");
    this.removeElement("blockRight");
  }

  static transitionLeft() {
    if (!this.isTransitionLeft || this.animationTimerPreview.finished) return;

    this.animationTimerPreview.update();

    //center
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter];

      preview.refPosition = {
        x: Settings.previewPositions[2].x + this.animationTimerPreview.progress * (Settings.previewPositions[1].x - Settings.previewPositions[2].x),
        y: Settings.previewPositions[2].y
      };

      preview.refSize = {
        x: Settings.previewSize.x * (0.9 + this.animationTimerPreview.progress * 0.1),
        y: Settings.previewSize.y * (0.9 + this.animationTimerPreview.progress * 0.1)
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + this.levelPrevieuwCenter, preview);
    })();

    //right
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter - 1];

      preview.refPosition = {
        x: Settings.previewPositions[1].x + this.animationTimerPreview.progress * (Settings.previewPositions[0].x - Settings.previewPositions[1].x),
        y: Settings.previewPositions[1].y
      };

      preview.refSize = {
        x: Settings.previewSize.x * (1 - this.animationTimerPreview.progress * 0.1),
        y: Settings.previewSize.y * (1 - this.animationTimerPreview.progress * 0.1)
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + (this.levelPrevieuwCenter - 1), preview);
    
    })();

    //going out
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter - 2];

      preview.refPosition = {
        x: Settings.previewPositions[0].x + this.animationTimerPreview.progress * (Settings.previewLeftOut.x - Settings.previewPositions[0].x),
        y: Settings.previewPositions[0].y
      };

      preview.refSize = {
        x: Settings.previewSize.x * (0.9 - this.animationTimerPreview.progress * 0.9),
        y: Settings.previewSize.y * (0.9 - this.animationTimerPreview.progress * 0.9)
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + (this.levelPrevieuwCenter - 2), preview);
    })();

    //extra
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter + 1];

      preview.refPosition = {
        x: Settings.previewRightOut.x + this.animationTimerPreview.progress * (Settings.previewPositions[2].x - Settings.previewRightOut.x),
        y: Settings.previewRightOut.y
      };

      preview.refSize = {
        x: Settings.previewSize.x * this.animationTimerPreview.progress * 0.9,
        y: Settings.previewSize.y * this.animationTimerPreview.progress * 0.9
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + (this.levelPrevieuwCenter + 1), preview);
    })();

    if (this.animationTimerPreview.progress === 1) {
      this.isTransitionLeft = false;
    }
  }

  static transitionRight() {
    if (!this.isTransitionRight || this.animationTimerPreview.finished) return;
    this.animationTimerPreview.update();
    //center
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter];

      preview.refPosition = {
        x: Settings.previewPositions[0].x + this.animationTimerPreview.progress * (Settings.previewPositions[1].x - Settings.previewPositions[0].x),
        y: Settings.previewPositions[0].y
      };

      preview.refSize = {
        x: Settings.previewSize.x * (0.9 + this.animationTimerPreview.progress * 0.1),
        y: Settings.previewSize.y * (0.9 + this.animationTimerPreview.progress * 0.1)
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + this.levelPrevieuwCenter, preview);
    })();

    //right
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter + 1];

      preview.refPosition = {
        x: Settings.previewPositions[1].x + this.animationTimerPreview.progress * (Settings.previewPositions[2].x - Settings.previewPositions[1].x),
        y: Settings.previewPositions[1].y
      };

      preview.refSize = {
        x: Settings.previewSize.x * (1 - this.animationTimerPreview.progress * 0.1),
        y: Settings.previewSize.y * (1 - this.animationTimerPreview.progress * 0.1)
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + (this.levelPrevieuwCenter + 1), preview);
    
    })();

    //going out
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter + 2];

      preview.refPosition = {
        x: Settings.previewPositions[2].x + this.animationTimerPreview.progress * (Settings.previewRightOut.x - Settings.previewPositions[2].x),
        y: Settings.previewPositions[2].y
      };

      preview.refSize = {
        x: Settings.previewSize.x * (0.9 - this.animationTimerPreview.progress * 0.9),
        y: Settings.previewSize.y * (0.9 - this.animationTimerPreview.progress * 0.9)
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + (this.levelPrevieuwCenter + 2), preview);
    })();

    //extra
    (() => {
      const preview = this.previews[this.levelPrevieuwCenter - 1];

      preview.refPosition = {
        x: Settings.previewLeftOut.x + this.animationTimerPreview.progress * (Settings.previewPositions[0].x - Settings.previewLeftOut.x),
        y: Settings.previewLeftOut.y
      };

      preview.refSize = {
        x: Settings.previewSize.x * this.animationTimerPreview.progress * 0.9,
        y: Settings.previewSize.y * this.animationTimerPreview.progress * 0.9
      };

      const center = {
        x: preview.refPosition.x + Settings.previewSize.x/2,
        y: preview.refPosition.y + Settings.previewSize.y/2
      };

      preview.refPosition = {
        x: center.x - preview.refSize.x/2,
        y: center.y - preview.refSize.y/2
      };

      preview.resize(this.screenPosition, this.screenSize);
      this.addElement("preview" + (this.levelPrevieuwCenter - 1), preview);
    })();

    if (this.animationTimerPreview.progress === 1) {
      this.isTransitionRight = false;
    }
  }

  static draw() {
    super.draw();
    if (!this.checkDrawNeeded()) return;
  }

  static resize() {
    super.resize();

    if (this.isTransitionIn || this.isTransitionOut) return;
    this.arrows.left.resize(this.screenPosition, this.screenSize);
    this.arrows.right.resize(this.screenPosition, this.screenSize);
    this.arrows.blockLeft.resize(this.screenPosition, this.screenSize);
    this.arrows.blockRight.resize(this.screenPosition, this.screenSize);
  }
}
