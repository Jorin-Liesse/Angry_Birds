import { Sprite, Text, Button, Slider, Switch, ChoiceBox } from "./UI.js";

export class Menu {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");

    this.activeMenu = "MainMenu"; // MainMenu, OptionsMenu, CreditsMenu, GameMenu,
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

                // this.sprites[menu][element].alwaysOpen = true;
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

    switch (this.activeMenu) {
      case "MainMenu":
        if (this.sprites.MainMenu.buttonStart.clicked()) this.clickedStart = true;
        if (this.sprites.MainMenu.buttonOptions.clicked()) this.activeMenu = "OptionsMenu";
        if (this.sprites.MainMenu.buttonQuit.clicked()) window.close();;

        break;
      case "OptionsMenu":
        if (this.sprites.OptionsMenu.buttonGraphics.clicked()) this.activeOptionsMenu = "GraphicsMenu";
        if (this.sprites.OptionsMenu.buttonSound.clicked()) this.activeOptionsMenu = "SoundMenu";
        if (this.sprites.OptionsMenu.buttonControlls.clicked()) this.activeOptionsMenu = "ControllsMenu";

        if (this.sprites.OptionsMenu.backButton.clicked()) this.activeMenu = "MainMenu";

        break;
      case "CreditsMenu":
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
