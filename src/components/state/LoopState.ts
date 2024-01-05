import { FrameData } from '../../sketch/FrameData.js';

export default class LoopState {
  finished: boolean;

  animationFrameRequest?: number;

  frameData: FrameData;

  paused: boolean;

  startTime: number;
  lastTime: number;

  constructor() {
    this.finished = false;

    this.frameData = {
      frame: 0,
      frameTime: 0,
      totalTime: 0,
    };

    this.paused = false;

    const start = Date.now();
    this.startTime = start;
    this.lastTime = start;
  }

  togglePause() {
    this.paused = !this.paused;
    console.log(this.paused ? 'Animation Paused' : 'Animation Unpaused');
  }

  nextFrame() {
    if (this.paused || this.finished) {
      // If paused or finished: no next frame check needed, just return false.
      return false;
    }

    const requestTime = Date.now();
    const ticks = requestTime - this.lastTime;

    // ticks > 10 is a bit of a hack. Animation Frame requests run at the 1/60th of a second (16 ms) but there is some small variance.
    // Usually ticks will be 14 to 18, but execeptions occur at startup/reset so checking for very quick draws prevents weird extra frame draws.
    if (ticks > 10) {
      this.frameData.frame += 1;
      this.frameData.frameTime = ticks;
      this.frameData.totalTime += ticks;

      this.lastTime = requestTime;

      return true;
    }
    return false;
  }

  restart() {
    this.finished = false;
    this.paused = false;

    this.frameData = {
      frame: 0,
      frameTime: 0,
      totalTime: 0,
    };

    const start = Date.now();
    this.startTime = start;
    this.lastTime = start;
  }
}
