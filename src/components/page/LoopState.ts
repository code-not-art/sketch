import FrameData from '../../sketch/FrameData';

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
  }

  nextFrame() {
    const requestTime = Date.now();
    const ticks = requestTime - this.lastTime;
    if (ticks > 10) {
      this.frameData.frame += 1;
      this.frameData.frameTime = ticks;
      this.frameData.totalTime += ticks;

      this.lastTime = requestTime;

      if (this.paused || this.finished) {
        return false;
      }

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
