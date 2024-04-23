export class AspectRatio {
  static #canvas;
  static aspectRatio = 16 / 9;

  static init() {
    this.#canvas = document.getElementById("mainCanvas");
    this.adjust();
  }

  static adjust() {
    if (window.innerHeight * this.aspectRatio > window.innerWidth) {
      this.#canvas.width = window.innerWidth;
      this.#canvas.height = window.innerWidth * (1 / this.aspectRatio);
    } else {
      this.#canvas.width = window.innerHeight * this.aspectRatio;
      this.#canvas.height = window.innerHeight;
    }
  }
}
