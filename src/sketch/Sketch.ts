import type {
  ControlPanelConfig,
  ControlPanelElements,
} from '../control-panel/types/controlPanel.js';
import { SketchConfig, SketchConfigInput } from './Config.js';
import { FrameData } from './FrameData.js';
import { SketchProps } from './SketchProps.js';

export type SketchReset<
  TParameters extends ControlPanelElements,
  DataModel extends object,
> = (
  props: SketchProps<ControlPanelConfig<TParameters>>,
  data: DataModel,
) => DataModel;
export type SketchInit<
  TParameters extends ControlPanelElements,
  DataModel extends object,
> = (props: SketchProps<ControlPanelConfig<TParameters>>) => DataModel;
export type SketchDraw<
  TParameters extends ControlPanelElements,
  DataModel extends object,
> = (
  props: SketchProps<ControlPanelConfig<TParameters>>,
  data: DataModel,
) => void;
/**
 * Function representing an animation loop. This will be run every frame by the Sketch Canvas.
 * This will continue to run until the funciton returns `true`. The return value is an indication if the animation is complete.
 * @returns Boolean indicating loop is finished. `false` to continue loop. `true` to end loop.
 */
export type SketchLoop<
  TParameters extends ControlPanelElements,
  DataModel extends object,
> = (
  props: SketchProps<ControlPanelConfig<TParameters>>,
  data: DataModel,
  frameData: FrameData,
) => boolean;

export type SketchDefinition<
  TParameters extends ControlPanelElements,
  DataModel extends object,
> = {
  config: ReturnType<typeof SketchConfig>;
  controls: TParameters;
  reset: SketchReset<TParameters, DataModel>;
  init: SketchInit<TParameters, DataModel>;
  draw: SketchDraw<TParameters, DataModel>;
  loop: SketchLoop<TParameters, DataModel>;
};

const defaultDraw = () => {
  // Draw nothing
};
const defaultLoop = () => {
  // Do nothing EVERY FRAME
  return true;
};
const defaultReset = <
  TControlPanel extends ControlPanelConfig<any>,
  DataModel extends object,
>(
  props: SketchProps<TControlPanel>,
  data: DataModel,
): DataModel => {
  props.canvas.clear();
  return data;
};

export type SketchInputs<
  TParameters extends ControlPanelElements,
  DataModel extends object,
> = {
  config?: SketchConfigInput;
  controls: TParameters;
  init: SketchInit<TParameters, DataModel>;
  draw?: SketchDraw<TParameters, DataModel>;
  loop?: SketchLoop<TParameters, DataModel>;
  reset?: SketchReset<TParameters, DataModel>;
};

export function Sketch<
  TParameters extends ControlPanelElements,
  DataModel extends object,
>(
  definition: SketchInputs<TParameters, DataModel>,
): SketchDefinition<TParameters, DataModel> {
  return {
    config: SketchConfig(definition.config || {}),
    controls: definition.controls,
    init: definition.init,
    draw: definition.draw || defaultDraw,
    loop: definition.loop || defaultLoop,
    reset:
      definition.reset ||
      defaultReset<ControlPanelConfig<TParameters>, DataModel>,
  };
}
