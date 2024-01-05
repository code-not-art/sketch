import { Parameter } from './Params.js';
import Config, { ConfigInput } from './Config.js';
import { SketchProps } from './SketchProps.js';
import { FrameData } from './FrameData.js';

export type ParameterModel = Record<string, Parameter>;

export type SketchReset<
  Params extends ParameterModel,
  DataModel extends object,
> = (props: SketchProps<Params>, data: DataModel) => DataModel;
export type SketchInit<
  Params extends ParameterModel,
  DataModel extends object,
> = (props: SketchProps<Params>) => DataModel;
export type SketchDraw<
  Params extends ParameterModel,
  DataModel extends object,
> = (props: SketchProps<Params>, data: DataModel) => void;
/**
 * Function representing an animation loop. This will be run every frame by the Sketch Canvas.
 * This will continue to run until the funciton returns `true`. The return value is an indication if the animation is complete.
 * @returns Boolean indicating loop is finished. `false` to continue loop. `true` to end loop.
 */
export type SketchLoop<
  Params extends ParameterModel,
  DataModel extends object,
> = (
  props: SketchProps<Params>,
  data: DataModel,
  frameData: FrameData,
) => boolean;

export type SketchDefinition<
  Params extends ParameterModel,
  DataModel extends object,
> = {
  config: ReturnType<typeof Config>;
  params: Params;
  reset: SketchReset<Params, DataModel>;
  init: SketchInit<Params, DataModel>;
  draw: SketchDraw<Params, DataModel>;
  loop: SketchLoop<Params, DataModel>;
};

const defaultDraw = () => {
  // Draw nothing
};
const defaultLoop = () => {
  // Do nothing EVERY FRAME
  return true;
};
const defaultReset = <Params extends ParameterModel, DataModel extends object>(
  props: SketchProps<Params>,
  data: DataModel,
) => {
  props.canvas.clear();
  return data;
};

export type SketchInputs<
  Params extends ParameterModel,
  DataModel extends object,
> = {
  config?: ConfigInput;
  params: Params;
  init: SketchInit<Params, DataModel>;
  draw?: SketchDraw<Params, DataModel>;
  loop?: SketchLoop<Params, DataModel>;
  reset?: SketchReset<Params, DataModel>;
};

function Sketch<Params extends ParameterModel, DataModel extends object>(
  definition: SketchInputs<Params, DataModel>,
): SketchDefinition<Params, DataModel> {
  return {
    config: Config(definition.config || {}),
    params: definition.params,
    init: definition.init,
    draw: definition.draw || defaultDraw,
    loop: definition.loop || defaultLoop,
    reset: definition.reset || defaultReset,
  };
}

export default Sketch;
