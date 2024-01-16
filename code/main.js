import { Line, Circle, Sprite, Text, Button, ChoiceBox, Slider, Switch } from "./UI.js";
import { Slingshot } from "./slingshot.js";
import { Player } from "./player.js";

class Main {
  #timeLastFrame = 0;
  #timeThisFrame = 0;

  #inputs = {};
  #currentinput = {};
  #previousinput = {};

  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.#adjustAspectRatio();

    this.#events();

    this.activeMenu = "MainMenu"; // MainMenu, OptionsMenu, CreditsMenu, Game, InGameMenu, LevelSelector,
    this.activeOptionsMenu = "GraphicsMenu"; // GraphicsMenu, SoundMenu, ControllsMenu,

    this.contentLoaded = false;

    this.screens = {};

    this.levelPrevieuwCenter = 2;

    fetch("menu.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        for (const menu in data) {
          this.screens[menu] = {};
          for (const element in data[menu]) {
            switch (data[menu][element].type) {
              case "Sprite":
                this.screens[menu][element] = new Sprite(
                  data[menu][element].path,
                  {
                    x: this.canvas.width * data[menu][element].position.x,
                    y: this.canvas.height * data[menu][element].position.y,
                  },
                  {
                    x: this.canvas.width * data[menu][element].size.x,
                    y: this.canvas.height * data[menu][element].size.y,
                  }
                );
                break;
              case "Text":
                this.screens[menu][element] = new Text(
                  data[menu][element].text,
                  {
                    x: this.canvas.width * data[menu][element].position.x,
                    y: this.canvas.height * data[menu][element].position.y,
                  },
                  this.canvas.width * data[menu][element].size,
                  data[menu][element].color
                );
                break;
              case "Button":
                this.screens[menu][element] = new Button(
                  data[menu][element].pathUp,
                  data[menu][element].pathDown,
                  data[menu][element].text,
                  {
                    x: this.canvas.width * data[menu][element].position.x,
                    y: this.canvas.height * data[menu][element].position.y,
                  },
                  {
                    x: this.canvas.width * data[menu][element].size.x,
                    y: this.canvas.height * data[menu][element].size.y,
                  }
                );
                break;
              case "ChoiceBox":
                this.screens[menu][element] = new ChoiceBox(
                  data[menu][element].pathOpen,
                  data[menu][element].pathClosed,
                  data[menu][element].options,
                  {
                    backSignOpen: {
                      x: this.canvas.width * data[menu][element].position.backSignOpen.x,
                      y: this.canvas.height * data[menu][element].position.backSignOpen.y,
                    },
                    backSignClosed: {
                      x: this.canvas.width * data[menu][element].position.backSignClosed.x,
                      y: this.canvas.height * data[menu][element].position.backSignClosed.y,
                    },
                    firstOption: {
                      x: this.canvas.width * data[menu][element].position.firstOption.x,
                      y: this.canvas.height * data[menu][element].position.firstOption.y,
                    },
                    otherOptions: [
                      {
                        x: this.canvas.width * data[menu][element].position.secondOptions.x,
                        y: this.canvas.height * data[menu][element].position.secondOptions.y,
                      },
                      {
                        x: this.canvas.width * data[menu][element].position.thirdOptions.x,
                        y: this.canvas.height * data[menu][element].position.thirdOptions.y,
                      },
                    ],
                  },
                  {
                    backSignOpen: {
                      x: this.canvas.width * data[menu][element].size.backSignOpen.x,
                      y: this.canvas.height * data[menu][element].size.backSignOpen.y,
                    },
                    backSignClosed: {
                      x: this.canvas.width * data[menu][element].size.backSignClosed.x,
                      y: this.canvas.height * data[menu][element].size.backSignClosed.y,
                    },
                    text: this.canvas.width * data[menu][element].size.text,
                  },
                  data[menu][element].color
                );

                this.screens[menu][element].alwaysOpen = true;
                break;
              case "Slider":
                this.screens[menu][element] = new Slider(
                  data[menu][element].pathBar,
                  data[menu][element].pathPin,
                  {
                    x: this.canvas.width * data[menu][element].position.x,
                    y: this.canvas.height * data[menu][element].position.y,
                  },
                  {
                    x: this.canvas.width * data[menu][element].size.x,
                    y: this.canvas.height * data[menu][element].size.y,
                  },
                  data[menu][element].value
                );
                break;
              case "Switch":
                this.screens[menu][element] = new Switch(
                  data[menu][element].pathOn,
                  data[menu][element].pathOff,
                  {
                    x: this.canvas.width * data[menu][element].position.x,
                    y: this.canvas.height * data[menu][element].position.y,
                  },
                  {
                    x: this.canvas.width * data[menu][element].size.x,
                    y: this.canvas.height * data[menu][element].size.y,
                  },
                  data[menu][element].value
                );
                break;
            }
          }
        }

        this.#atLoaded();
        this.contentLoaded = true;
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  }

  run() {
    this.#update();
    this.#draw();

    requestAnimationFrame(this.run.bind(this));
  }

  #update() {
    this.#deltaTime();
    this.currentInput = JSON.parse(JSON.stringify(this.#inputs));

    if (!this.contentLoaded) return;

    this.screens.Game.player.slingshot = this.screens.Game.slingshot;

    switch (this.activeMenu) {
      case "MainMenu":
        if (this.screens.MainMenu.buttonStart.clicked()) this.activeMenu = "LevelSelector";
        if (this.screens.MainMenu.buttonOptions.clicked()) this.activeMenu = "OptionsMenu";
        if (this.screens.MainMenu.buttonQuit.clicked()) window.close();

        if (this.screens.MainMenu.infoButton.clicked()) this.activeMenu = "CreditsMenu";
        break;
      case "OptionsMenu":
        switch (this.activeOptionsMenu) {
          case "GraphicsMenu":
            if (this.screens[this.activeOptionsMenu].buttonSound.clicked()) this.activeOptionsMenu = "SoundMenu";
            if (this.screens[this.activeOptionsMenu].buttonControlls.clicked()) this.activeOptionsMenu = "ControllsMenu";
            break;

          case "SoundMenu":
            if (this.screens[this.activeOptionsMenu].buttonGraphics.clicked()) this.activeOptionsMenu = "GraphicsMenu";
            if (this.screens[this.activeOptionsMenu].buttonControlls.clicked()) this.activeOptionsMenu = "ControllsMenu";
            break;

          case "ControllsMenu":
            if (this.screens[this.activeOptionsMenu].buttonGraphics.clicked()) this.activeOptionsMenu = "GraphicsMenu";
            if (this.screens[this.activeOptionsMenu].buttonSound.clicked()) this.activeOptionsMenu = "SoundMenu";
            break;
        }

        if (this.#currentinput.keysPressed[27] && !this.#previousinput.keysPressed[27]) this.activeMenu = "MainMenu";
        if (this.screens.OptionsMenu.backButton.clicked()) this.activeMenu = "MainMenu";

        break;
      case "CreditsMenu":
        if (this.#currentinput.keysPressed[27] && !this.#previousinput.keysPressed[27]) this.activeMenu = "MainMenu";
        if (this.screens.CreditsMenu.backButton.clicked()) this.activeMenu = "MainMenu";
        break;
      case "LevelSelector":
        if (this.#currentinput.keysPressed[27] && !this.#previousinput.keysPressed[27]) this.activeMenu = "MainMenu";
        if (this.screens.LevelSelector.backButton.clicked()) this.activeMenu = "MainMenu";

        if (this.screens.LevelSelector.arrowsButtonLeft && this.screens.LevelSelector.arrowsButtonLeft.clicked()) {
          this.levelPrevieuwCenter -= 1;
          this.#arrangeLevelPrevieuws();
        }
        if (this.screens.LevelSelector.arrowsButtonRight && this.screens.LevelSelector.arrowsButtonRight.clicked()) {
          this.levelPrevieuwCenter += 1;
          this.#arrangeLevelPrevieuws();
        }

        for (let level in this.screens.LevelSelector) {
          if (level.includes("level")) {
            if (this.screens.LevelSelector[level].clicked()) {
              this.activeMenu = "Game";
            }
          }
        }

        break;
      case "Game":
        if (this.#currentinput.keysPressed[27] && !this.#previousinput.keysPressed[27]) this.activeMenu = "InGameMenu";
        if (this.screens.Game.pauseButton.clicked()) this.activeMenu = "InGameMenu";
        if (this.screens.Game.inventoryButton.clicked()) this.activeMenu = "Inventory";
        break;

      case "InGameMenu":
        if (this.#currentinput.keysPressed[27] && !this.#previousinput.keysPressed[27]) this.activeMenu = "Game";

        if (this.screens.InGameMenu.resumeButton.clicked()) this.activeMenu = "Game";
        if (this.screens.InGameMenu.restartButton.clicked()) this.activeMenu = "Game";
        if (this.screens.InGameMenu.exitButton.clicked()) this.activeMenu = "MainMenu";
        break;

      case "Inventory":
        if (this.#currentinput.keysPressed[27] && !this.#previousinput.keysPressed[27]) this.activeMenu = "Game";

        if (this.screens.Inventory.backButton.clicked()) this.activeMenu = "Game";
        break;
    }

    for (let sprite in this.screens[this.activeMenu]) {
      this.screens[this.activeMenu][sprite].update(this.dt, this.#currentinput);
    }

    if (this.activeMenu == "OptionsMenu") {
      for (let sprite in this.screens[this.activeOptionsMenu]) {
        this.screens[this.activeOptionsMenu][sprite].update(this.dt, this.#currentinput);
      }
    }

    this.#previousinput = JSON.parse(JSON.stringify(this.#currentinput));
  }

  #draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.contentLoaded) return;

    for (let sprite in this.screens[this.activeMenu]) {
      this.screens[this.activeMenu][sprite].draw();
    }

    if (this.activeMenu == "OptionsMenu") {
      for (let sprite in this.screens[this.activeOptionsMenu]) {
        this.screens[this.activeOptionsMenu][sprite].draw();
      }
    }
  }

  #deltaTime() {
    this.#timeThisFrame = performance.now();
    this.dt = (this.#timeThisFrame - this.#timeLastFrame) / 1000;
    this.#timeLastFrame = this.#timeThisFrame;
  }

  #adjustAspectRatio() {
    if ((window.innerHeight * 16) / 9 > window.innerWidth) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = (window.innerWidth * 9) / 16;
    } else {
      this.canvas.width = (window.innerHeight * 16) / 9;
      this.canvas.height = window.innerHeight;
    }
  }

  #events() {
    this.#inputs.keysPressed = {};
    this.#inputs.mouseButtonsPressed = {};
    this.#inputs.mousePosition = {};

    for (let i = 0; i <= 255; i++) {
      this.#inputs.keysPressed[i] = false;
    }

    this.#inputs.mouseButtonsPressed[0] = false;
    this.#inputs.mouseButtonsPressed[1] = false;
    this.#inputs.mouseButtonsPressed[2] = false;

    this.#inputs.mousePosition.x = 0;
    this.#inputs.mousePosition.y = 0;

    document.addEventListener("keydown", (event) => {
      this.#inputs.keysPressed[event.keyCode] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.#inputs.keysPressed[event.keyCode] = false;
    });

    document.addEventListener("mousedown", (event) => {
      this.#inputs.mouseButtonsPressed[event.button] = true;
    });

    document.addEventListener("mouseup", (event) => {
      this.#inputs.mouseButtonsPressed[event.button] = false;
    });

    document.addEventListener("mousemove", (event) => {
      this.#inputs.mousePosition.x =
        event.clientX - (window.innerWidth - this.canvas.width) / 2;
      this.#inputs.mousePosition.y =
        event.clientY - (window.innerHeight - this.canvas.height) / 2;
    });

    window.addEventListener("resize", function () {
      location.reload();
    });

    this.#currentinput = this.#inputs;
    this.#previousinput = this.#inputs;
  }

  #atLoaded() {
    this.#arrangeLevelPrevieuws();

    this.screens.Game.player = new Player();

    this.screens.Game.slingshot = new Slingshot(
      {x: this.canvas.width * 0.220, y: this.canvas.height * 0.525},
      {x: this.canvas.width * 0.089, y: this.canvas.height * 0.259},
      this.canvas.width * 0.15);
  }

  #arrangeLevelPrevieuws() {
    const previeuwPositions = [{ x: 0.226, y: 0.301 }, { x: 0.406, y: 0.280 }, { x: 0.606, y: 0.301 }];
    
    // Assuming you have the following objects
    const levelSelectorKeys = Object.keys(this.screens.LevelSelector);
    const bigKeys = Object.keys(this.screens.LevelsButtonBig);
    const smallKeys = Object.keys(this.screens.LevelsButtonSmall);
    const notVisibleKeys = Object.keys(this.screens.NotVisable);

    // Find common keys
    const commonKeys = levelSelectorKeys.filter(key => bigKeys.includes(key) || smallKeys.includes(key) || notVisibleKeys.includes(key));

    // Remove common keys from LevelSelector
    commonKeys.forEach(key => delete this.screens.LevelSelector[key]);

    this.screens.LevelSelector[`level${this.levelPrevieuwCenter - 1}`] = this.screens.LevelsButtonSmall[`level${this.levelPrevieuwCenter - 1}`];
    this.screens.LevelSelector[`level${this.levelPrevieuwCenter - 1}`].changePosition({x: this.canvas.width * previeuwPositions[0].x, y: this.canvas.height * previeuwPositions[0].y});

    this.screens.LevelSelector[`level${this.levelPrevieuwCenter}`] = this.screens.LevelsButtonBig[`level${this.levelPrevieuwCenter}`];
    this.screens.LevelSelector[`level${this.levelPrevieuwCenter}`].changePosition({x: this.canvas.width * previeuwPositions[1].x, y: this.canvas.height * previeuwPositions[1].y});
    
    this.screens.LevelSelector[`level${this.levelPrevieuwCenter + 1}`] = this.screens.LevelsButtonSmall[`level${this.levelPrevieuwCenter + 1}`];
    this.screens.LevelSelector[`level${this.levelPrevieuwCenter + 1}`].changePosition({x: this.canvas.width * previeuwPositions[2].x, y: this.canvas.height * previeuwPositions[2].y});

    if (this.levelPrevieuwCenter <= 2) {
      this.screens.LevelSelector["blockArrowsLeft"] = this.screens.NotVisable["blockArrowsLeft"];
      this.screens.LevelSelector["arrowsButtonRight"] = this.screens.NotVisable["arrowsButtonRight"];
    }
    else if (this.levelPrevieuwCenter >= 4) {
      this.screens.LevelSelector["blockArrowsRight"] = this.screens.NotVisable["blockArrowsRight"];
      this.screens.LevelSelector["arrowsButtonLeft"] = this.screens.NotVisable["arrowsButtonLeft"];
    }
    else {
      this.screens.LevelSelector["arrowsButtonLeft"] = this.screens.NotVisable["arrowsButtonLeft"];
      this.screens.LevelSelector["arrowsButtonRight"] = this.screens.NotVisable["arrowsButtonRight"];
    }

    // this.levelPrevieuwCenter = 2; min = 0; max = 4;

    // this.levelPrevieuw; max = 2;

    // console.log(Object.keys(this.sprites.LevelSelector).length);

    this.screens.LevelSelector;

    this.screens.LevelsButtonBig;
    this.screens.LevelsButtonSmall;
    this.screens.NotVisable;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const main = new Main();
  main.run();
});
