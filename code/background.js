export class Background {
  angle = -Math.PI / 16;
  colors = ["#2f042f", "#1d042f"]; // ["#610C9F", "#940B92", "#DA0C81", "#E95793"]
  lineWidth = 60;
  speed = 100;

  constructor() {
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.offset = { x: 0, y: 0 };

    this.#createBaseLine(this.angle);
    this.#calculateLines();
  }

  update(dt, intputs) {
    this.offset.y += this.speed * dt;

    if (this.offset.y > this.lineWidth * this.colors.length) {
      this.offset.y -= this.lineWidth * this.colors.length;
    }

    this.offsetlines = [];
    this.lines.forEach((line, index) => {
      this.offsetlines.push(this.#addOffset(line, this.offset));
    });
  }

  draw() {
    this.offsetlines.forEach((line, index) => {
      this.ctx.beginPath();
      this.ctx.moveTo(line[0].x, line[0].y);
      this.ctx.lineTo(line[1].x, line[1].y);
      this.ctx.strokeStyle = this.colors[index % this.colors.length];
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.stroke();
    });
  }

  #createBaseLine(angle) {
    if (Math.tan(angle) < 0) {
      this.baseLine = [
        { x: 0, y: 0 },
        {
          x: this.canvas.width,
          y: (Math.tan(angle) * this.canvas.width),
        },
      ];

      this.baseLine = this.#addOffset(this.baseLine, {x: 0, y: -this.lineWidth * this.colors.length});
      this.baseLine = this.#addMargin(this.baseLine, {x: this.lineWidth / 2, y: 0});
    } 
    
    else {
      this.baseLine = [
        { x: 0, y: (-Math.tan(angle) * this.canvas.width) },
        { x: this.canvas.width, y: 0 },
      ];

      this.baseLine = this.#addOffset(this.baseLine, {x: 0, y: -this.lineWidth * this.colors.length});
      this.baseLine = this.#addMargin(this.baseLine, {x: this.lineWidth / 2, y: 0});
    }
  }

  #calculateLines() {
    this.lines = [];

    this.lines.push([
      { x: this.baseLine[0].x, y: this.baseLine[0].y },
      { x: this.baseLine[1].x, y: this.baseLine[1].y },
    ]);

    if (Math.tan(this.angle) < 0) {
      for (
        let i = this.lineWidth;
        this.lines[this.lines.length - 1][1].y < this.canvas.height;
        i += this.lineWidth
      ) {
        this.lines.push([
          { x: this.baseLine[0].x, y: this.baseLine[0].y + i },
          { x: this.baseLine[1].x, y: this.baseLine[1].y + i },
        ]);
      }
    }

    else {
      for (
        let i = this.lineWidth;
        this.lines[this.lines.length - 1][0].y < this.canvas.height;
        i += this.lineWidth
      ) {
        this.lines.push([
          { x: this.baseLine[0].x, y: this.baseLine[0].y + i },
          { x: this.baseLine[1].x, y: this.baseLine[1].y + i },
        ]);
      }
    }
    
  }

  #addOffset(line, offset) {
    return [
      { x: line[0].x + offset.x, y: line[0].y + offset.y },
      { x: line[1].x - offset.x, y: line[1].y + offset.y },
    ];
  }

  #addMargin(line, margin) {
    return [
      { x: line[0].x - margin.x, y: line[0].y },
      { x: line[1].x + margin.x, y: line[1].y },
    ];
  }
}
