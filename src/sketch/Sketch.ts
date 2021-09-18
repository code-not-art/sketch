import Params from './Params';
import Config, { ConfigInput } from './Config';
import SketchProps from './SketchProps';
import FrameData from './FrameData';

export type SketchDefinition = {
  reset?: (props: SketchProps) => void;
  init?: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop?: (props: SketchProps, frameData: FrameData) => boolean;
  params?: Params;
  config?: ConfigInput;
};

const defaultInit = () => {
  // Intentionally do nothing.
};
const defaultLoop = () => {
  // Do nothing EVERY FRAME
  return false;
};
const defaultReset = (props: SketchProps) => {
  props.canvas.clear();
};

class Sketch {
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, frameData: FrameData) => boolean;
  reset: (props: SketchProps) => void;
  params: Params;
  config: Config;

  constructor(input: SketchDefinition) {
    this.config = new Config(input.config || {});
    this.params = input.params || [];

    this.init = input.init || defaultInit;
    this.reset = input.reset || defaultReset;
    this.loop = input.loop || defaultLoop;

    this.draw = input.draw;
  }
}

export default Sketch;
