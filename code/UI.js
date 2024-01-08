export class Sprite {
  constructor(path, position, size) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.position = position;
    this.size = size;

    this.image = new Image();
    this.image.src = path;

    this.isFlippedVertical = false;
    this.isFlippedHorizontal = false;

    this.isLoaded = false;

    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  update(dt, inputs) {}

  draw() {
    if (this.isLoaded) {
      this.ctx.save();

      if (this.isFlippedHorizontal || this.isFlippedVertical) {
        this.ctx.translate(
          this.position.x + this.size.x / 2,
          this.position.y + this.size.y / 2
        );

        if (this.isFlippedHorizontal) {
          this.ctx.scale(-1, 1);
        }
        if (this.isFlippedVertical) {
          this.ctx.scale(1, -1);
        }

        this.ctx.translate(
          -(this.position.x + this.size.x / 2),
          -(this.position.y + this.size.y / 2)
        );
      }

      this.ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );

      this.ctx.restore();
    }
  }
}

export class Text {
  constructor(text, position, size, color) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.text = text;
    this.position = position;
    this.size = size;
    this.color = color;

    this.ctx.font = `${this.size}px "Ubuntu Title"`;
    this.ctx.fillStyle = this.color;

    this.width = this.ctx.measureText(this.text).width;

    this.height = parseInt(this.ctx.font) / 2;
  }

  update(dt, inputs) {}

  draw() {
    this.ctx.font = `${this.size}px "Ubuntu Title"`;
    this.ctx.fillStyle = this.color;

    this.ctx.fillText(
      this.text,
      this.position.x,
      this.position.y + this.height
    );
  }
}

export class Button {
  constructor(pathUp, pathDown, text, position, size) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.buttonSpriteUp = new Sprite(pathUp, position, size);
    this.buttonSpriteDown = new Sprite(pathDown, position, size);

    this.buttonTextUp = new Text(text, position, size.x / 4, "#c6ac9f");
    this.buttonTextDown = new Text(text, position, size.x / 4.5, "#c6ac9f");

    this.buttonTextUp.position = {
      x: position.x + size.x / 2 - this.buttonTextUp.width / 2,
      y: position.y + size.y / 2 - this.buttonTextUp.height / 2,
    };
    this.buttonTextDown.position = {
      x: position.x + size.x / 2 - this.buttonTextDown.width / 2,
      y:
        position.y +
        size.y / 2 +
        this.canvas.height * 0.012 -
        this.buttonTextDown.height / 2,
    };

    this.position = position;
    this.size = size;

    this.status = "up";
    this.previousMouse = "up";

    this.previousMouse = false;
    this.currentMouse = false;
  }

  update(dt, inputs) {
    if (
      inputs.mousePosition.x > this.position.x &&
      inputs.mousePosition.x < this.position.x + this.size.x &&
      inputs.mousePosition.y > this.position.y &&
      inputs.mousePosition.y < this.position.y + this.size.y &&
      inputs.mouseButtonsPressed[0]
    ) {
      this.status = "down";
    } else {
      this.status = "up";
    }

    this.currentMouse = inputs.mouseButtonsPressed[0];
  }

  draw() {
    if (this.status === "up") {
      this.buttonSpriteUp.draw();
      this.buttonTextUp.draw();
    } else {
      this.buttonSpriteDown.draw();
      this.buttonTextDown.draw();
    }
  }

  clicked() {
    if (
      !this.currentMouse &&
      this.previousMouse &&
      this.previousstatus === "down"
    ) {
      this.previousMouse = this.currentMouse;
      this.previousstatus = this.status;
      return true;
    } else {
      this.previousMouse = this.currentMouse;
      this.previousstatus = this.status;
      return false;
    }
  }
}

export class ChoiceBox {
  constructor(pathOpen, pathClosed, options, positions, sizes, color) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.choiceBoxSpriteOpen = new Sprite(
      pathOpen,
      positions.backSignOpen,
      sizes.backSignOpen
    );
    this.choiceBoxSpriteClosed = new Sprite(
      pathClosed,
      positions.backSignClosed,
      sizes.backSignClosed
    );

    this.options = [];
    for (let i = 0; i < options.length; i++) {
      this.options[i] = new Text(options[i], { x: 0, y: 0 }, sizes.text, color);
    }

    this.positions = positions;
    this.sizes = sizes;

    this.status = "closed";

    this.arrangeText();
  }

  update(dt, inputs) {
    if (
      inputs.mousePosition.x > this.positions.backSignClosed.x &&
      inputs.mousePosition.x <
        this.positions.backSignClosed.x + this.sizes.backSignClosed.x &&
      inputs.mousePosition.y > this.positions.backSignClosed.y &&
      inputs.mousePosition.y <
        this.positions.backSignClosed.y + this.sizes.backSignClosed.y &&
      inputs.mouseButtonsPressed[0]
    ) {
      this.status = "open";
    } else if (
      !(
        inputs.mousePosition.x >= this.positions.backSignOpen.x &&
        inputs.mousePosition.x <=
          this.positions.backSignOpen.x + this.sizes.backSignOpen.x &&
        inputs.mousePosition.y >= this.positions.backSignOpen.y &&
        inputs.mousePosition.y <=
          this.positions.backSignOpen.y + this.sizes.backSignOpen.y
      ) &&
      inputs.mouseButtonsPressed[0]
    ) {
      this.status = "closed";
    }

    if (this.status === "open") {
      for (let i = 1; i < this.options.length; i++) {
        if (
          inputs.mousePosition.x > this.options[i].position.x &&
          inputs.mousePosition.x <
            this.options[i].position.x + this.options[i].width &&
          inputs.mousePosition.y > this.options[i].position.y &&
          inputs.mousePosition.y <
            this.options[i].position.y + this.options[i].height &&
          inputs.mouseButtonsPressed[0]
        ) {
          this.options = [
            this.options[i],
            ...this.options.filter((item) => item !== this.options[i]),
          ];

          this.arrangeText();
          this.status = "closed";
        }
      }
    }
  }

  draw() {
    if (this.status === "closed") {
      this.choiceBoxSpriteClosed.draw();
      this.options[0].draw();
    } else {
      this.choiceBoxSpriteOpen.draw();
      for (let i = 0; i < this.options.length; i++) {
        this.options[i].draw();
      }
    }
  }

  arrangeText() {
    for (let i = 0; i < this.options.length; i++) {
      if (i === 0) {
        this.options[i].position = this.positions.firstOption;
      } else {
        this.options[i].position = this.positions.otherOptions[i - 1];
      }

      this.options[i].position = {
        x: this.options[i].position.x - this.options[i].width / 2,
        y: this.options[i].position.y - this.options[i].height / 2,
      };
    }
  }
}

export class Slider {
  constructor(pathBar, pathPin, position, size, startPercentage) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.position = position;
    this.size = size;
    this.status = "passive";
    this.startPercentage = startPercentage;
    this.previousMouse = false;
    this.isLoaded = false;
    this.setSize = false;

    this.sliderSpriteBar = new Sprite(pathBar, position, size);
    this.sliderSpritePin = new Sprite(pathPin, { x: 0, y: 0 }, size);
  }

  update(dt, inputs) {
    if (this.sliderSpriteBar && this.sliderSpritePin && !this.setSize  ) {
      this.sliderSpritePin.size = {
        x:
          this.sliderSpritePin.image.width *
          (this.sliderSpriteBar.size.y / this.sliderSpritePin.image.height),
        y: this.size.y,
      };

      this.sliderSpritePin.position = {
        x: this.position.x + (this.size.x - this.sliderSpritePin.size.x) * this.startPercentage,
        y: this.position.y,
      };

      this.setSize = true;
      this.isLoaded = true;
    }

    if (this.isLoaded) {
      if (
        inputs.mousePosition.x > this.sliderSpritePin.position.x &&
        inputs.mousePosition.x <
          this.sliderSpritePin.position.x + this.sliderSpritePin.size.x &&
        inputs.mousePosition.y > this.sliderSpritePin.position.y &&
        inputs.mousePosition.y <
          this.sliderSpritePin.position.y + this.sliderSpritePin.size.y &&
        inputs.mouseButtonsPressed[0]
      ) {
        this.status = "active";
      } else if (this.previousMouse && !inputs.mouseButtonsPressed[0]) {
        this.status = "passive";
      }
  
      if (this.status === "active") {
        this.sliderSpritePin.position.x =
          inputs.mousePosition.x - this.sliderSpritePin.size.x / 2;
  
        if (this.sliderSpritePin.position.x < this.position.x) {
          this.sliderSpritePin.position.x = this.position.x;
        } else if (
          this.sliderSpritePin.position.x >
          this.position.x + this.size.x - this.sliderSpritePin.size.x
        ) {
          this.sliderSpritePin.position.x =
            this.position.x + this.size.x - this.sliderSpritePin.size.x;
        }
      }
  
      this.previousMouse = inputs.mouseButtonsPressed[0];
    }
  }

  draw() {
    if (this.isLoaded) {
      this.sliderSpriteBar.draw();
      this.sliderSpritePin.draw();
    }
  }

  getPocentage() {
    return (
      (this.sliderSpritePin.position.x - this.position.x) /
      (this.size.x - this.sliderSpritePin.size.x)
    );
  }
}

export class Switch {
  constructor(path, position, size, status) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.switchOn = new Sprite(path, position, size);
    this.switchOn.isFlippedHorizontal = true;

    this.switchOff = new Sprite(path, position, size);
    this.switchOff.isFlippedVertical = true;

    this.position = position;
    this.size = size;

    this.status = status;

    this.previousMouse = false;
  }

  update(dt, inputs) {
    if (
      inputs.mousePosition.x > this.position.x &&
      inputs.mousePosition.x < this.position.x + this.size.x &&
      inputs.mousePosition.y > this.position.y &&
      inputs.mousePosition.y < this.position.y + this.size.y &&
      inputs.mouseButtonsPressed[0] &&
      !this.previousMouse
    ) {
      if (this.status === "off") {
        this.status = "on";
      } else {
        this.status = "off";
      }
    }

    this.previousMouse = inputs.mouseButtonsPressed[0];
  }

  draw() {
    if (this.status === "on") {
      this.switchOn.draw();
    } else {
      this.switchOff.draw();
    }
  }
}
