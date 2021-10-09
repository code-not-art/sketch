import { Parameter } from './Params';
import Config, { ConfigInput } from './Config';
import SketchProps from './SketchProps';
import FrameData from './FrameData';

export type SketchDefinition = {
  reset?: (props: SketchProps) => void;
  init?: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop?: (props: SketchProps, frameData: FrameData) => boolean;
  params?: Parameter[];
  config?: ConfigInput;
};

const defaultInit = () => {
  // Intentionally do nothing.
};
const defaultLoop = () => {
  // Do nothing EVERY FRAME
  return true;
};
const defaultReset = (props: SketchProps) => {
  props.canvas.clear();
};

const Sketch = (
  definition: SketchDefinition,
): {
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, frameData: FrameData) => boolean;
  reset: (props: SketchProps) => void;
  params: Parameter[];
  config: ReturnType<typeof Config>;
} => ({
  config: Config(definition.config || {}),
  params: definition.params || [],

  init: definition.init || defaultInit,
  draw: definition.draw,
  loop: definition.loop || defaultLoop,
  reset: definition.reset || defaultReset,
});

export default Sketch;
