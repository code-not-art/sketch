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

const Sketch = (
  input: SketchDefinition,
): {
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, frameData: FrameData) => boolean;
  reset: (props: SketchProps) => void;
  params: Params;
  config: ReturnType<typeof Config>;
} => ({
  config: Config(input.config || {}),
  params: input.params || [],

  init: input.init || defaultInit,
  draw: input.draw,
  loop: input.loop || defaultLoop,
  reset: input.reset || defaultReset,
});

export default Sketch;
