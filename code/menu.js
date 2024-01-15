import { Sprite, Text, Button, Slider, Switch, ChoiceBox, Circle } from "./UI.js";

export class Menu {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.activeMenu = "MainMenu"; // MainMenu, OptionsMenu, CreditsMenu, GameMenu, LevelSelector,
    this.activeOptionsMenu = "GraphicsMenu"; // GraphicsMenu, SoundMenu, ControllsMenu,
    this.clickedStart = false;
    this.contentLoaded = false;

    this.sprites = {};

    fetch("menu.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        for (const menu in data) {
          this.sprites[menu] = {};
          for (const element in data[menu]) {
            switch (data[menu][element].type) {
              case "Sprite":
                this.sprites[menu][element] = new Sprite(
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
                this.sprites[menu][element] = new Text(
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
                this.sprites[menu][element] = new Button(
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
                this.sprites[menu][element] = new ChoiceBox(
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

                this.sprites[menu][element].alwaysOpen = true;
                break;
              case "Slider":
                this.sprites[menu][element] = new Slider(
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
                this.sprites[menu][element] = new Switch(
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

        this.contentLoaded = true;
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  }

  update(dt, inputs) {
    if (!this.contentLoaded) return;

    const position = {x: 1342.69, y: 773.72};
    const size = {x: 230.1, y: 43.75};

    const centerPosition = {x: ((position.x + size.x /2) / 1920) * this.canvas.width, y: ((position.y + size.y /2) / 1080) * this.canvas.height};

    const test = {x: centerPosition.x - this.sprites.GraphicsMenu.textResolution.width / 2,
    y: centerPosition.y - this.sprites.GraphicsMenu.textResolution.height / 2};

    console.log({x: centerPosition.x / this.canvas.width, y: centerPosition.y / this.canvas.height});

    switch (this.activeMenu) {
      case "MainMenu":
        if (this.sprites.MainMenu.buttonStart.clicked()) this.activeMenu = "LevelSelector";
        if (this.sprites.MainMenu.buttonOptions.clicked()) this.activeMenu = "OptionsMenu";
        if (this.sprites.MainMenu.buttonQuit.clicked()) window.close();

        if (this.sprites.MainMenu.infoButton.clicked()) this.activeMenu = "CreditsMenu";
        break;
      case "OptionsMenu":
        switch (this.activeOptionsMenu) {
          case "GraphicsMenu":
            if (this.sprites[this.activeOptionsMenu].buttonSound.clicked()) this.activeOptionsMenu = "SoundMenu";
            if (this.sprites[this.activeOptionsMenu].buttonControlls.clicked()) this.activeOptionsMenu = "ControllsMenu";
            break;

          case "SoundMenu":
            if (this.sprites[this.activeOptionsMenu].buttonGraphics.clicked()) this.activeOptionsMenu = "GraphicsMenu";
            if (this.sprites[this.activeOptionsMenu].buttonControlls.clicked()) this.activeOptionsMenu = "ControllsMenu";
            break;

          case "ControllsMenu":
            if (this.sprites[this.activeOptionsMenu].buttonGraphics.clicked()) this.activeOptionsMenu = "GraphicsMenu";
            if (this.sprites[this.activeOptionsMenu].buttonSound.clicked()) this.activeOptionsMenu = "SoundMenu";
            break;
        }

        if (inputs.keysPressed[27]) this.activeMenu = "MainMenu";
        if (this.sprites.OptionsMenu.backButton.clicked()) this.activeMenu = "MainMenu";

        break;
      case "CreditsMenu":
        if (inputs.keysPressed[27]) this.activeMenu = "MainMenu";
        if (this.sprites.CreditsMenu.backButton.clicked()) this.activeMenu = "MainMenu";
        break;
      case "LevelSelector":
        if (inputs.keysPressed[27]) this.activeMenu = "MainMenu";
        if (this.sprites.LevelSelector.backButton.clicked()) this.activeMenu = "MainMenu";
        break;
      case "GameMenu":
        break;
    }

    for (let sprite in this.sprites[this.activeMenu]) {
      this.sprites[this.activeMenu][sprite].update(dt, inputs);
    }

    if (this.activeMenu == "OptionsMenu") {
      for (let sprite in this.sprites[this.activeOptionsMenu]) {
        this.sprites[this.activeOptionsMenu][sprite].update(dt, inputs);
      }
    }
  }

  draw() {
    if (!this.contentLoaded) return;

    for (let sprite in this.sprites[this.activeMenu]) {
      this.sprites[this.activeMenu][sprite].draw();
    }

    if (this.activeMenu == "OptionsMenu") {
      for (let sprite in this.sprites[this.activeOptionsMenu]) {
        this.sprites[this.activeOptionsMenu][sprite].draw();
      }
    }
  }
}
