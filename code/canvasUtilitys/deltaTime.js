export class DeltaTime {
  static #timeLastFrame = 0;
  static #timeThisFrame = 0;

  static wasHidden = false;

  static init() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') {
        this.wasHidden = true;
      }
    });
  }

  static update() {
    this.#timeThisFrame = performance.now();
    if (!this.wasHidden) {
      this.dt = (this.#timeThisFrame - this.#timeLastFrame);
    }
    else {
      this.wasHidden = false;
    }
    
    this.#timeLastFrame = this.#timeThisFrame;

  }
}
