import Params, { Params as ParamsType } from './Params';
import Config, { ConfigInput } from './Config';
import SketchProps from './SketchProps';
import FrameData from './FrameData';

type SketchDefinition = {
  reset?: (props: SketchProps) => void;
  init?: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop?: (props: SketchProps, frameData: FrameData) => void;
  params?: ParamsType;
  config?: ConfigInput;
};

const defaultInit = (props: SketchProps) => {
  // Intentionally do nothing.
};
const defaultLoop = (props: SketchProps, frameData: FrameData) => {
  // Do nothing EVERY FRAME
};
const defaultReset = (props: SketchProps) => {
  props.canvas.clear();
};

class Sketch {
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, frameData: FrameData) => void;
  reset: (props: SketchProps) => void;
  params: ParamsType;
  config: Config;

  constructor(input: SketchDefinition) {
    this.config = new Config(input.config || {});
    this.params = input.params || Params();

    this.init = input.init || defaultInit;
    this.reset = input.reset || defaultReset;
    this.loop = input.loop || defaultLoop;

    this.draw = input.draw;
  }
}

export default Sketch;
