import { DeltaTime } from './deltaTime.js';

export class AnimationTimer {
  constructor(animationDuration) {
    this.animationDuration = animationDuration;
    this.currentTime = 0;
    this.progress = 0;
    this.finished = true;
    this.started = false;
  }

  update() {
    if (this.finished) return;
    if (!this.started) return;

    this.currentTime += DeltaTime.dt;
    this.progress = this.currentTime / this.animationDuration;

    if (this.progress >= 1) {
      this.progress = 1;
      this.finished = true;
    }
  }

  reset() {
    this.currentTime = 0;
    this.progress = 0;
    this.finished = false;
  }

  start() {
    this.reset();
    this.started = true;
  }

  pause() {
    this.started = false;
  }

  stop() {
    this.started = false;
  }
}
