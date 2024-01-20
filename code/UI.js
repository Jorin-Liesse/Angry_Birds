export class Line {
  constructor(startPosition, endPosition, width, color) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.width = width;
    this.color = color;
  }

  update(dt, inputs) {}

  draw() {
    const { ctx, color, width, startPosition, endPosition } = this;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(endPosition.x, endPosition.y);
    ctx.stroke();

    ctx.restore();
  }
}

export class Circle {
  constructor(position, radius, color) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  update(dt, inputs) {}

  draw() {
    this.ctx.save();

    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.restore();
  }
}

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

    this.angle = 0;

    this.isLoaded = false;

    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  update(dt, inputs) {}

  draw() {
    if (!this.isLoaded) return;

    this.ctx.save();

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

    this.ctx.rotate(this.angle);

    this.ctx.drawImage(
      this.image,
      -this.size.x / 2,
      -this.size.y / 2,
      this.size.x,
      this.size.y
    );

    this.ctx.restore();
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

    this.isButton = false;

    this.setupText();
  }

  setupText() {
    this.ctx.font = `${this.size}px "Ubuntu Title"`;
    this.ctx.fillStyle = this.color;

    this.width = this.ctx.measureText(this.text).width;
    this.height = parseInt(this.ctx.font) / 2;
  }

  update(dt, inputs) {}

  draw() {
    this.ctx.textAlign = this.isButton ? "center" : "start";
    this.setupText();

    this.ctx.fillText(
      this.text,
      this.position.x,
      this.position.y + this.height
    );
  }

  setIsButton() {
    this.isButton = true;
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

    this.downSound = new Audio('assets/audio/UI/buttonDown.mp3');
    this.upSound = new Audio('assets/audio/UI/buttonUp.mp3');

    this.buttonTextUp.setIsButton();
    this.buttonTextDown.setIsButton();

    this.buttonTextUp.position = {
      x: position.x + size.x / 2,
      y: position.y + size.y / 2 - this.buttonTextUp.height / 2,
    };
    this.buttonTextDown.position = {
      x: position.x + size.x / 2,
      y: position.y + size.y / 2 + this.canvas.height * 0.01 - this.buttonTextUp.height / 2,
    };

    this.position = position;
    this.size = size;

    this.status = "up";

    this.previousMouse = false;
    this.currentMouse = false;
    this.previousstatus = "up";
  }

  update(dt, inputs) {
    this.currentMouse = inputs.mouseButtonsPressed[0];

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
    let click = false;

    if (this.currentMouse && !this.previousMouse && this.previousstatus === "up" && this.status === "down"){
      this.upSound.play();
    }

    if (!this.currentMouse && this.previousMouse && this.previousstatus === "down") {
      click = true;
      this.downSound.play();
    }

    this.previousstatus = this.status;
    this.previousMouse = this.currentMouse;

    return click;
  }

  changePosition(position) {
    this.position = position;
    this.buttonSpriteUp.position = position;
    this.buttonSpriteDown.position = position;

    this.buttonTextUp.position = {
      x: position.x + this.size.x / 2,
      y: position.y + this.size.y / 2 - this.buttonTextUp.height / 2,
    };
    this.buttonTextDown.position = {
      x: position.x + this.size.x / 2,
      y: position.y + this.size.y / 2 + this.canvas.height * 0.01 - this.buttonTextUp.height / 2,
    };
  }
}

export class ChoiceBox {
  constructor(pathOpen, pathClosed, options, positions, sizes, color) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.positions = positions;
    this.sizes = sizes;

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

    this.sound = new Audio('assets/audio/UI/buttonUp.mp3');

    this.options = options.map((option) => new Text(option, { x: 0, y: 0 }, sizes.text, color));

    this.alwaysOpen = false;
    this.status = "closed";
    this.previousMouse = false;
    this.currentMouse = false;

    this.arrangeText();
  }

  update(dt, inputs) {
    this.currentMouse = inputs.mouseButtonsPressed[0];

    const closedBounds =
      inputs.mousePosition.x > this.positions.backSignClosed.x &&
      inputs.mousePosition.x < this.positions.backSignClosed.x + this.sizes.backSignClosed.x &&
      inputs.mousePosition.y > this.positions.backSignClosed.y &&
      inputs.mousePosition.y < this.positions.backSignClosed.y + this.sizes.backSignClosed.y;

    const openBounds =
      inputs.mousePosition.x > this.positions.backSignOpen.x &&
      inputs.mousePosition.x < this.positions.backSignOpen.x + this.sizes.backSignOpen.x &&
      inputs.mousePosition.y > this.positions.backSignOpen.y &&
      inputs.mousePosition.y < this.positions.backSignOpen.y + this.sizes.backSignOpen.y;

    if (!this.currentMouse && this.previousMouse && closedBounds && this.status === "closed") {
      this.status = "open";
    } else if (
      (!(openBounds && !this.currentMouse && this.previousMouse) || closedBounds) &&
      !this.currentMouse &&
      this.previousMouse
    ) {
      this.status = "closed";
    }

    if (this.status === "open") {
      for (let i = 1; i < this.options.length; i++) {
        const optionBounds =
          inputs.mousePosition.x > this.options[i].position.x &&
          inputs.mousePosition.x < this.options[i].position.x + this.options[i].width &&
          inputs.mousePosition.y > this.options[i].position.y &&
          inputs.mousePosition.y < this.options[i].position.y + this.options[i].height;

        if (!this.currentMouse && this.previousMouse && optionBounds) {
          this.options = [this.options[i], ...this.options.filter((item) => item !== this.options[i])];
          this.sound.play();
          this.arrangeText();
          this.status = "closed";
        }
      }
    }

    if (this.alwaysOpen) {
      this.status = "open";
    }

    this.previousMouse = this.currentMouse;
  }

  draw() {
    if (this.status === "closed") {
      this.choiceBoxSpriteClosed.draw();
      this.options[0].draw();
    } else {
      this.choiceBoxSpriteOpen.draw();
      this.options.forEach((option) => option.draw());
    }
  }

  arrangeText() {
    this.options.forEach((option, i) => {
      option.position =
        i === 0 ? this.positions.firstOption : this.positions.otherOptions[i - 1];

      option.position = {
        x: option.position.x - option.width / 2,
        y: option.position.y - option.height / 2,
      };
    });


  }
}

export class Slider {
  constructor(pathBar, pathPin, position, size, startPercentage) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.position = position;
    this.size = size;
    this.status = "passive";
    this.previousStatus = "passive";
    this.startPercentage = startPercentage;
    this.previousMouse = false;
    this.isLoaded = false;
    this.setSize = false;

    this.sliderSpriteBar = new Sprite(pathBar, position, size);
    this.sliderSpritePin = new Sprite(pathPin, { x: 0, y: 0 }, size);

    this.sound = new Audio('assets/audio/UI/buttonUp.mp3');
  }

  update(dt, inputs) {
    if (this.sliderSpriteBar && this.sliderSpritePin && !this.setSize) {
      this.setupSliderSizeAndPosition();
    }

    if (this.isLoaded) {
      this.handleMouseInteraction(inputs);

      this.previousMouse = inputs.mouseButtonsPressed[0];
    }

    const pin = this.sliderSpritePin;
    const mousePos = inputs.mousePosition;

    if (
      mousePos.x > pin.position.x &&
      mousePos.x < pin.position.x + pin.size.x &&
      mousePos.y > pin.position.y &&
      mousePos.y < pin.position.y + pin.size.y &&
      inputs.mouseButtonsPressed[0] &&
      this.previousStatus === "passive"
    ) {
      this.sound.play();
    }

    this.previousStatus = this.status;
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

  setupSliderSizeAndPosition() {
    this.sliderSpritePin.size = {
      x: this.sliderSpritePin.image.width * (this.sliderSpriteBar.size.y / this.sliderSpritePin.image.height),
      y: this.size.y,
    };

    this.sliderSpritePin.position = {
      x: this.position.x + (this.size.x - this.sliderSpritePin.size.x) * this.startPercentage,
      y: this.position.y,
    };

    this.setSize = true;
    this.isLoaded = true;
  }

  handleMouseInteraction(inputs) {
    const pin = this.sliderSpritePin;
    const mousePos = inputs.mousePosition;

    if (
      mousePos.x > pin.position.x &&
      mousePos.x < pin.position.x + pin.size.x &&
      mousePos.y > pin.position.y &&
      mousePos.y < pin.position.y + pin.size.y &&
      inputs.mouseButtonsPressed[0]
    ) {
      this.status = "active";
    } else if (this.previousMouse && !inputs.mouseButtonsPressed[0]) {
      this.status = "passive";
    }

    if (this.status === "active") {
      pin.position.x = Math.max(this.position.x, Math.min(mousePos.x - pin.size.x / 2, this.position.x + this.size.x - pin.size.x));
    }
  }
}

export class Switch {
  constructor(pathOn, pathOff, position, size, status) {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.switchOn = new Sprite(pathOn, position, size);
    this.switchOff = new Sprite(pathOff, position, size);

    this.sound = new Audio('assets/audio/UI/buttonUp.mp3');

    this.position = position;
    this.size = size;
    this.status = status;
    this.previousMouse = false;
  }

  update(dt, inputs) {
    const isMouseOver =
      inputs.mousePosition.x > this.position.x &&
      inputs.mousePosition.x < this.position.x + this.size.x &&
      inputs.mousePosition.y > this.position.y &&
      inputs.mousePosition.y < this.position.y + this.size.y;

    if (isMouseOver && inputs.mouseButtonsPressed[0] && !this.previousMouse) {
      this.status = this.status === "off" ? "on" : "off";
      this.sound.play();
    }

    this.previousMouse = inputs.mouseButtonsPressed[0];
  }

  draw() {
    this.status === "on" ? this.switchOn.draw() : this.switchOff.draw();
  }
}
