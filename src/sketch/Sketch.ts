import { Parameter } from './Params';
import Config, { ConfigInput } from './Config';
import SketchProps from './SketchProps';
import FrameData from './FrameData';

export interface ParameterModel {
  [key: string]: Parameter;
}

export type SketchInputs<PM extends ParameterModel, DataModel> = {
  config?: ConfigInput;
  initialData: DataModel;
  params: PM;
  reset?: (props: SketchProps<PM, DataModel>) => void;
  init?: (props: SketchProps<PM, DataModel>) => void;
  draw: (props: SketchProps<PM, DataModel>) => void;
  loop?: (props: SketchProps<PM, DataModel>, frameData: FrameData) => boolean;
};

export type SketchDefinition<PM extends ParameterModel, DataModel> = {
  config: ReturnType<typeof Config>;
  initialData: DataModel;
  params: PM;
  reset: (props: SketchProps<PM, DataModel>) => void;
  init: (props: SketchProps<PM, DataModel>) => void;
  draw: (props: SketchProps<PM, DataModel>) => void;
  loop: (props: SketchProps<PM, DataModel>, frameData: FrameData) => boolean;
};

const defaultInit = () => {
  // Intentionally do nothing.
};
const defaultLoop = () => {
  // Do nothing EVERY FRAME
  return true;
};
const defaultReset = <PM extends ParameterModel, DataModel>(
  props: SketchProps<PM, DataModel>,
) => {
  props.canvas.clear();
};

export type SketchReset<PM extends ParameterModel, DataModel> = (
  props: SketchProps<PM, DataModel>,
) => void;
export type SketchInit<PM extends ParameterModel, DataModel> = (
  props: SketchProps<PM, DataModel>,
) => void;
export type SketchDraw<PM extends ParameterModel, DataModel> = (
  props: SketchProps<PM, DataModel>,
) => void;
export type SketchLoop<PM extends ParameterModel, DataModel> = (
  props: SketchProps<PM, DataModel>,
  frameData: FrameData,
) => boolean;

function Sketch<PM extends ParameterModel, DataModel>(
  definition: SketchInputs<PM, DataModel>,
): SketchDefinition<PM, DataModel> {
  return {
    config: Config(definition.config || {}),
    initialData: definition.initialData,
    params: definition.params,
    init: definition.init || defaultInit,
    draw: definition.draw,
    loop: definition.loop || defaultLoop,
    reset: definition.reset || defaultReset,
  };
}

export default Sketch;
