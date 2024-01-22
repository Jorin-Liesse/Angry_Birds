import { Sprite, Text, Button, Slider, Switch, ChoiceBox } from "./UI.js";

export class Menu {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.activeMenu = "main"; // main, options, credits,
    this.clickedStart = false;

    this.mainMenu = new MainMenu();
    this.optionsMenu = new OptionsMenu();
  }

  update(dt, inputs) {
    switch (this.activeMenu) {
      case "main":
        this.mainMenu.update(dt, inputs);

        if (this.mainMenu.clickedStart) {
          this.clickedStart = true;
          this.mainMenu.clickedStart = false;
        } else if (this.mainMenu.clickedOptions) {
          this.activeMenu = "options";
          this.mainMenu.clickedOptions = false;
        }
        break;
      case "options":
        this.optionsMenu.update(dt, inputs);

        if (this.optionsMenu.clickedBack) {
          this.activeMenu = "main";
          this.optionsMenu.clickedBack = false;
        }

        break;
    }
  }

  draw() {
    switch (this.activeMenu) {
      case "main":
        this.mainMenu.draw();
        break;
      case "options":
        this.optionsMenu.draw();
        break;
    }
  }
}

class MainMenu {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.sprites = {};

    this.clickedStart = false;
    this.clickedOptions = false;

    this.sprites.backSign = new Sprite(
      "assets/UI/BackFrameSmall.png",
      { x: this.canvas.width * (31 / 90), y: this.canvas.height * (7 / 60) },
      { x: this.canvas.width * (14 / 45), y: this.canvas.height * (23 / 30) }
    );

    this.sprites.titleBox = new Sprite(
      "assets/UI/TitleBox.png",
      { x: this.canvas.width * (117 / 360), y: this.canvas.height * (1 / 40) },
      {
        x: this.canvas.width * (313 / 900),
        y: this.canvas.height * (109 / 480),
      }
    );

    this.sprites.title = new Sprite(
      "assets/UI/AngryBirds.png",
      { x: this.canvas.width * (117 / 360), y: this.canvas.height * (1 / 40) },
      {
        x: this.canvas.width * (313 / 900),
        y: this.canvas.height * (109 / 480),
      }
    );

    this.sprites.buttonStart = new Button(
      "assets/UI/ButtonUp.png",
      "assets/UI/ButtonDown.png",
      "Start",
      { x: this.canvas.width * (7 / 18), y: this.canvas.height * (7 / 30) },
      { x: this.canvas.width * (2 / 9), y: this.canvas.height * (3 / 20) }
    );

    this.sprites.buttonOptions = new Button(
      "assets/UI/ButtonUp.png",
      "assets/UI/ButtonDown.png",
      "Options",
      { x: this.canvas.width * (7 / 18), y: this.canvas.height * (17 / 40) },
      { x: this.canvas.width * (2 / 9), y: this.canvas.height * (3 / 20) }
    );

    this.sprites.buttonQuit = new Button(
      "assets/UI/ButtonUp.png",
      "assets/UI/ButtonDown.png",
      "Quit",
      { x: this.canvas.width * (7 / 18), y: this.canvas.height * (37 / 60) },
      { x: this.canvas.width * (2 / 9), y: this.canvas.height * (3 / 20) }
    );
  }

  update(dt, inputs) {
    for (let sprite in this.sprites) {
      this.sprites[sprite].update(dt, inputs);
    }

    if (this.sprites.buttonStart.clicked()) {
      this.clickedStart = true;
    } else if (this.sprites.buttonOptions.clicked()) {
      this.clickedOptions = true;
    } else if (this.sprites.buttonQuit.clicked()) {
      window.close();
    }
  }

  draw() {
    for (let sprite in this.sprites) {
      this.sprites[sprite].draw();
    }
  }
}

class OptionsMenu {
  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.sprites = {};

    this.graphicsSprites = {};
    this.soundSprites = {};
    this.controllsSprites = {};

    this.clickedBack = false;

    this.activeMenu = "graphics"; // graphics, sound, controlls

    this.sprites.Button = new Sprite(
      "assets/UI/BackFrameSmall.png",
      { x: this.canvas.width * (14 / 225), y: this.canvas.height * (7 / 60) },
      { x: this.canvas.width * (14 / 45), y: this.canvas.height * (23 / 30) }
    );

    this.sprites.titleBox = new Sprite(
      "assets/UI/TitleBox.png",
      { x: this.canvas.width * (2 / 45), y: this.canvas.height * (1 / 40) },
      {
        x: this.canvas.width * (313 / 900),
        y: this.canvas.height * (109 / 480),
      }
    );

    this.sprites.title = new Sprite(
      "assets/UI/Options.png",
      { x: this.canvas.width * (2 / 45), y: this.canvas.height * (1 / 40) },
      {
        x: this.canvas.width * (313 / 900),
        y: this.canvas.height * (109 / 480),
      }
    );

    this.soundSprites.buttonGraphics = this.controllsSprites.buttonGraphics =
      new Button(
        "assets/UI/ButtonUp.png",
        "assets/UI/ButtonDown.png",
        "Graphics",
        { x: this.canvas.width * (8 / 75), y: this.canvas.height * (7 / 30) },
        { x: this.canvas.width * (2 / 9), y: this.canvas.height * (3 / 20) }
      );

    this.graphicsSprites.buttonSound = this.controllsSprites.buttonSound =
      new Button(
        "assets/UI/ButtonUp.png",
        "assets/UI/ButtonDown.png",
        "Sound",
        { x: this.canvas.width * (8 / 75), y: this.canvas.height * (17 / 40) },
        { x: this.canvas.width * (2 / 9), y: this.canvas.height * (3 / 20) }
      );

    this.graphicsSprites.buttonControlls = this.soundSprites.buttonControlls =
      new Button(
        "assets/UI/ButtonUp.png",
        "assets/UI/ButtonDown.png",
        "Controlls",
        { x: this.canvas.width * (8 / 75), y: this.canvas.height * (37 / 60) },
        { x: this.canvas.width * (2 / 9), y: this.canvas.height * (3 / 20) }
      );

    this.graphicsSprites.blockGraphics = new Sprite(
      "assets/UI/BlockButton.png",
      { x: this.canvas.width * (43 / 450), y: this.canvas.height * (9 / 40) },
      { x: this.canvas.width * (11 / 45), y: this.canvas.height * (79 / 480) }
    );

    this.graphicsSprites.textGraphics = new Text(
      "Graphics",
      { x: this.canvas.width * (43 / 450), y: this.canvas.height * (9 / 40) },
      this.canvas.width * (11 / 180),
      "#c6ac9f"
    );

    this.graphicsSprites.textGraphics.position = {
      x:
        this.graphicsSprites.blockGraphics.position.x +
        this.graphicsSprites.blockGraphics.size.x / 2 -
        this.graphicsSprites.textGraphics.width / 2,
      y:
        this.graphicsSprites.blockGraphics.position.y +
        this.graphicsSprites.blockGraphics.size.y / 2 -
        this.graphicsSprites.textGraphics.height / 2,
    };

    this.soundSprites.blockSound = new Sprite(
      "assets/UI/BlockButton.png",
      { x: this.canvas.width * (43 / 450), y: this.canvas.height * (5 / 12) },
      { x: this.canvas.width * (11 / 45), y: this.canvas.height * (79 / 480) }
    );

    this.soundSprites.textSound = new Text(
      "Sound",
      { x: this.canvas.width * (43 / 450), y: this.canvas.height * (5 / 12) },
      this.canvas.width * (11 / 180),
      "#c6ac9f"
    );

    this.soundSprites.textSound.position = {
      x:
        this.soundSprites.blockSound.position.x +
        this.soundSprites.blockSound.size.x / 2 -
        this.soundSprites.textSound.width / 2,
      y:
        this.soundSprites.blockSound.position.y +
        this.soundSprites.blockSound.size.y / 2 -
        this.soundSprites.textSound.height / 2,
    };

    this.controllsSprites.blockControlls = new Sprite(
      "assets/UI/BlockButton.png",
      { x: this.canvas.width * (43 / 450), y: this.canvas.height * (73 / 120) },
      { x: this.canvas.width * (11 / 45), y: this.canvas.height * (79 / 480) }
    );

    this.controllsSprites.textControlls = new Text(
      "Controlls",
      { x: this.canvas.width * (43 / 450), y: this.canvas.height * (73 / 120) },
      this.canvas.width * (11 / 180),
      "#c6ac9f"
    );

    this.controllsSprites.textControlls.position = {
      x:
        this.controllsSprites.blockControlls.position.x +
        this.controllsSprites.blockControlls.size.x / 2 -
        this.controllsSprites.textControlls.width / 2,
      y:
        this.controllsSprites.blockControlls.position.y +
        this.controllsSprites.blockControlls.size.y / 2 -
        this.controllsSprites.textControlls.height / 2,
    };

    this.sprites.backSignOptions = new Sprite(
      "assets/UI/BackFrameMedium.png",
      { x: this.canvas.width * (19 / 45), y: this.canvas.height * (7 / 60) },
      { x: this.canvas.width * (116 / 225), y: this.canvas.height * (23 / 30) }
    );

    this.sprites.backButton = new Button(
      "assets/UI/CrossButtonUp.png",
      "assets/UI/CrossButtonDown.png",
      "",
      { x: this.canvas.width * (89 / 100), y: this.canvas.height * (29 / 480) },
      { x: this.canvas.width * (7 / 90), y: this.canvas.height * (7 / 48) }
    );

    this.controllsSprites.controllsPC = new Sprite(
      "assets/UI/ControllsPC.png",
      {
        x: this.canvas.width * (203 / 450),
        y: this.canvas.height * (33 / 160),
      },
      { x: this.canvas.width * (79 / 180), y: this.canvas.height * (3 / 5) }
    );

    this.soundSprites.textMasterVolume = new Text(
      "Master Volume",
      { x: this.canvas.width * (17 / 25), y: this.canvas.height * (7 / 30) },
      this.canvas.width * (7 / 180),
      "#c6ac9f"
    );

    this.soundSprites.textMasterVolume.position = {
      x:
        this.soundSprites.textMasterVolume.position.x -
        this.soundSprites.textMasterVolume.width / 2,
      y:
        this.soundSprites.textMasterVolume.position.y -
        this.soundSprites.textMasterVolume.height / 2,
    };

    this.soundSprites.textMusicVolume = new Text(
      "Music Volume",
      { x: this.canvas.width * (17 / 25), y: this.canvas.height * (109 / 240) },
      this.canvas.width * (7 / 180),
      "#c6ac9f"
    );

    this.soundSprites.textMusicVolume.position = {
      x:
        this.soundSprites.textMusicVolume.position.x -
        this.soundSprites.textMusicVolume.width / 2,
      y:
        this.soundSprites.textMusicVolume.position.y -
        this.soundSprites.textMusicVolume.height / 2,
    };

    this.soundSprites.textSoundEffectVolume = new Text(
      "Sound Effect Volume",
      { x: this.canvas.width * (17 / 25), y: this.canvas.height * (27 / 40) },
      this.canvas.width * (7 / 180),
      "#c6ac9f"
    );

    this.soundSprites.textSoundEffectVolume.position = {
      x:
        this.soundSprites.textSoundEffectVolume.position.x -
        this.soundSprites.textSoundEffectVolume.width / 2,
      y:
        this.soundSprites.textSoundEffectVolume.position.y -
        this.soundSprites.textSoundEffectVolume.height / 2,
    };

    this.soundSprites.sliderMasterVolume = new Slider(
      "assets/UI/SliderBar.png",
      "assets/UI/SliderPin.png",
      {
        x: this.canvas.width * (149 / 300),
        y: this.canvas.height * (127 / 480),
      },
      { x: this.canvas.width * (16 / 45), y: this.canvas.height * (1 / 10) }
    );

    this.soundSprites.sliderMasterVolume.setPocentage(0.25);

    this.soundSprites.sliderMusicVolume = new Slider(
      "assets/UI/SliderBar.png",
      "assets/UI/SliderPin.png",
      { x: this.canvas.width * (112 / 225), y: this.canvas.height * (29 / 60) },
      { x: this.canvas.width * (16 / 45), y: this.canvas.height * (1 / 10) }
    );

    this.soundSprites.sliderMusicVolume.setPocentage(0.75);

    this.soundSprites.sliderSoundEffectVolume = new Slider(
      "assets/UI/SliderBar.png",
      "assets/UI/SliderPin.png",
      {
        x: this.canvas.width * (449 / 900),
        y: this.canvas.height * (169 / 240),
      },
      { x: this.canvas.width * (16 / 45), y: this.canvas.height * (1 / 10) }
    );

    this.soundSprites.sliderSoundEffectVolume.setPocentage(0.25);

    this.graphicsSprites.textWinwdowMode = new Text(
      "Window Mode",
      { x: this.canvas.width * (527 / 900), y: this.canvas.height * (17 / 96) },
      this.canvas.width * (7 / 180)
    );

    this.graphicsSprites.textWinwdowMode.position = {
      x:
        this.graphicsSprites.textWinwdowMode.position.x -
        this.graphicsSprites.textWinwdowMode.width / 2,
      y:
        this.graphicsSprites.textWinwdowMode.position.y -
        this.graphicsSprites.textWinwdowMode.height / 2,
    };

    this.graphicsSprites.textFPS = new Text(
      "FPS",
      { x: this.canvas.width * (49 / 60), y: this.canvas.height * (17 / 96) },
      this.canvas.width * (7 / 180)
    );

    this.graphicsSprites.textFPS.position = {
      x:
        this.graphicsSprites.textFPS.position.x -
        this.graphicsSprites.textFPS.width / 2,
      y:
        this.graphicsSprites.textFPS.position.y -
        this.graphicsSprites.textFPS.height / 2,
    };

    this.graphicsSprites.textShowFPS = new Text(
      "Show FPS",
      { x: this.canvas.width * (491 / 900), y: this.canvas.height * (11 / 20) },
      this.canvas.width * (7 / 180)
    );

    this.graphicsSprites.textShowFPS.position = {
      x:
        this.graphicsSprites.textShowFPS.position.x -
        this.graphicsSprites.textShowFPS.width / 2,
      y:
        this.graphicsSprites.textShowFPS.position.y -
        this.graphicsSprites.textShowFPS.height / 2,
    };

    this.graphicsSprites.textAntiAliasing = new Text(
      "Anti Aliasing",
      {
        x: this.canvas.width * (491 / 900),
        y: this.canvas.height * (349 / 480),
      },
      this.canvas.width * (7 / 180)
    );

    this.graphicsSprites.textAntiAliasing.position = {
      x:
        this.graphicsSprites.textAntiAliasing.position.x -
        this.graphicsSprites.textAntiAliasing.width / 2,
      y:
        this.graphicsSprites.textAntiAliasing.position.y -
        this.graphicsSprites.textAntiAliasing.height / 2,
    };

    this.graphicsSprites.textResolution = new Text(
      "Resolution",
      { x: this.canvas.width * (58 / 75), y: this.canvas.height * (11 / 20) },
      this.canvas.width * (7 / 180)
    );

    this.graphicsSprites.textResolution.position = {
      x:
        this.graphicsSprites.textResolution.position.x -
        this.graphicsSprites.textResolution.width / 2,
      y:
        this.graphicsSprites.textResolution.position.y -
        this.graphicsSprites.textResolution.height / 2,
    };

    this.graphicsSprites.switchShowFPS = new Switch(
      "assets/UI/Switch.png",
      {
        x: this.canvas.width * (451 / 900),
        y: this.canvas.height * (93 / 160),
      },
      { x: this.canvas.width * (4 / 45), y: this.canvas.height * (1 / 12) }
    );

    this.graphicsSprites.switchAntiAliasing = new Switch(
      "assets/UI/Switch.png",
      {
        x: this.canvas.width * (451 / 900),
        y: this.canvas.height * (181 / 240),
      },
      { x: this.canvas.width * (4 / 45), y: this.canvas.height * (1 / 12) }
    );

    // this.graphicsSprites.choiceBoxWindowMode = new Sprite(
    //   "assets/UI/ChoiceBoxWindowMode.png",
    //   { x: this.canvas.width * (143/300), y: this.canvas.height * (5/24) },
    //   { x: this.canvas.width * (49/225), y: this.canvas.height * (41/160) },
    // );

    // this.graphicsSprites.choiceBoxFPS = new Sprite(
    //   "assets/UI/ChoiceBoxFPS.png",
    //   { x: this.canvas.width * (679/900), y: this.canvas.height * (5/24) },
    //   { x: this.canvas.width * (28/225), y: this.canvas.height * (41/160) },
    // );

    // this.graphicsSprites.choiceBoxResolution = new Sprite(
    //   "assets/UI/ChoiceBoxResolution.png",
    //   { x: this.canvas.width * (197/300), y: this.canvas.height * (93/160) },
    //   { x: this.canvas.width * (7/30), y: this.canvas.height * (41/160) },
    // );

    this.graphicsSprites.choiceBoxWindowMode = new ChoiceBox(
      "assets/UI/ChoiceBoxWindowModeOpen.png",
      "assets/UI/ChoiceBoxWindowModeClosed.png",
      ["Windowed", "Fullscreen", "Borderless"],
      {
        backSignOpen: {
          x: this.canvas.width * (143 / 300),
          y: this.canvas.height * (5 / 24),
        },
        backSignClosed: {
          x: this.canvas.width * (109/225),
          y: this.canvas.height * (53/240),
        },
        firstOption: {
          x: this.canvas.width * (17/30),
          y: this.canvas.height * (127/480),
        },
        otherOptions: [
          {
            x: this.canvas.width * (527/900),
            y: this.canvas.height * (163/480),
          },
          {
            x: this.canvas.width * (527/900),
            y: this.canvas.height * (5/12),
          },
        ],
      },
      {
        backSignOpen: {
          x: this.canvas.width * (49/225),
          y: this.canvas.height * (41/160),
        },
        backSignClosed: {
          x: this.canvas.width * (179/900),
          y: this.canvas.height * (19/240),
        },
        text: this.canvas.width * (143 / 300) / 15,
      },
      "#c6ac9f"
    );

    this.graphicsSprites.choiceFPS = new ChoiceBox(
      "assets/UI/ChoiceBoxFPSOpen.png",
      "assets/UI/ChoiceBoxFPSClosed.png",
      ["60", "30", "144"],
      {
        backSignOpen: {
          x: this.canvas.width * (679/900),
          y: this.canvas.height * (5 / 24),
        },
        backSignClosed: {
          x: this.canvas.width * (343/450),
          y: this.canvas.height * (53/240),
        },
        firstOption: {
          x: this.canvas.width * (4/5),
          y: this.canvas.height * (127/480),
        },
        otherOptions: [
          {
            x: this.canvas.width * (49/60),
            y: this.canvas.height * (163/480),
          },
          {
            x: this.canvas.width * (49/60),
            y: this.canvas.height * (5/12),
          },
        ],
      },
      {
        backSignOpen: {
          x: this.canvas.width * (28/225),
          y: this.canvas.height * (41/160),
        },
        backSignClosed: {
          x: this.canvas.width * (49/450),
          y: this.canvas.height * (19/240),
        },
        text: this.canvas.width * (143 / 300) / 15,
      },
      "#c6ac9f"
    );

    this.graphicsSprites.choiceResolution = new ChoiceBox(
      "assets/UI/ChoiceBoxResolutionOpen.png",
      "assets/UI/ChoiceBoxResolutionClosed.png",
      ["1920X1080", "1280x720", "3840x2160"],
      {
        backSignOpen: {
          x: this.canvas.width * (197/300),
          y: this.canvas.height * (93/160),
        },
        backSignClosed: {
          x: this.canvas.width * (2/3),
          y: this.canvas.height * (19/32),
        },
        firstOption: {
          x: this.canvas.width * (677/900),
          y: this.canvas.height * (307/480),
        },
        otherOptions: [ 
          {
            x: this.canvas.width * (58/75),
            y: this.canvas.height * (43/60),
          },
          {
            x: this.canvas.width * (58/75),
            y: this.canvas.height * (127/160),
          },
        ],
      },
      {
        backSignOpen: {
          x: this.canvas.width * (7/30),
          y: this.canvas.height * (41/160),
        },
        backSignClosed: {
          x: this.canvas.width * (191/900),
          y: this.canvas.height * (19/240),
        },
        text: this.canvas.width * (143 / 300) / 15,
      },
      "#c6ac9f"
    );
  }

  update(dt, inputs) {
    for (let sprite in this.sprites) {
      this.sprites[sprite].update(dt, inputs);
    }

    if (inputs.keysPressed[27] || this.sprites.backButton.clicked()) {
      this.clickedBack = true;
    }

    switch (this.activeMenu) {
      case "graphics":
        for (let sprite in this.graphicsSprites) {
          this.graphicsSprites[sprite].update(dt, inputs);
        }

        if (this.graphicsSprites.buttonSound.clicked()) {
          this.activeMenu = "sound";
        } else if (this.graphicsSprites.buttonControlls.clicked()) {
          this.activeMenu = "controlls";
        }
        break;
      case "sound":
        for (let sprite in this.soundSprites) {
          this.soundSprites[sprite].update(dt, inputs);
        }
        if (this.soundSprites.buttonGraphics.clicked()) {
          this.activeMenu = "graphics";
        } else if (this.soundSprites.buttonControlls.clicked()) {
          this.activeMenu = "controlls";
        }
        break;
      case "controlls":
        for (let sprite in this.controllsSprites) {
          this.controllsSprites[sprite].update(dt, inputs);
        }

        if (this.controllsSprites.buttonGraphics.clicked()) {
          this.activeMenu = "graphics";
        } else if (this.controllsSprites.buttonSound.clicked()) {
          this.activeMenu = "sound";
        }
        break;
    }
  }

  draw() {
    for (let sprite in this.sprites) {
      this.sprites[sprite].draw();
    }

    switch (this.activeMenu) {
      case "graphics":
        for (let sprite in this.graphicsSprites) {
          this.graphicsSprites[sprite].draw();
        }
        break;
      case "sound":
        for (let sprite in this.soundSprites) {
          this.soundSprites[sprite].draw();
        }
        break;
      case "controlls":
        for (let sprite in this.controllsSprites) {
          this.controllsSprites[sprite].draw();
        }
        break;
    }
  }
}
