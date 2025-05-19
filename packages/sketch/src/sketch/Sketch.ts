import type { ControlPanelConfig, ControlPanelElements } from '../control-panel/types/controlPanel.js';
import { Identity } from '../types/Identity.js';
import { createSketchConfig, SketchConfig, SketchConfigInput } from './Config.js';
import { FrameData } from './FrameData.js';
import { SketchProps } from './SketchProps.js';

export type SketchReset<SketchParameters extends ControlPanelElements, SketchData extends object> = (
	props: SketchProps<ControlPanelConfig<SketchParameters>>,
	data: SketchData,
) => SketchData;
export type SketchInit<SketchParameters extends ControlPanelElements, SketchData extends object> = (
	props: SketchProps<ControlPanelConfig<SketchParameters>>,
) => SketchData;
export type SketchDraw<SketchParameters extends ControlPanelElements, SketchData extends object> = (
	props: SketchProps<ControlPanelConfig<SketchParameters>>,
	data: SketchData,
) => void;
/**
 * Function representing an animation loop. This will be run every frame by the Sketch Canvas.
 * This will continue to run until the funciton returns `true`. The return value is an indication if the animation is complete.
 * @returns Boolean indicating loop is finished. `false` to continue loop. `true` to end loop.
 */
export type SketchLoop<SketchParameters extends ControlPanelElements, SketchData extends object> = (
	props: SketchProps<ControlPanelConfig<SketchParameters>>,
	data: SketchData,
	frameData: FrameData,
) => boolean;

export type SketchDefinition<SketchParameters extends ControlPanelElements, SketchData extends object> = {
	config: SketchConfig;
	controls: SketchParameters;
	reset: SketchReset<SketchParameters, SketchData>;
	init: SketchInit<SketchParameters, SketchData>;
	draw: SketchDraw<SketchParameters, SketchData>;
	loop: SketchLoop<SketchParameters, SketchData>;
};

const defaultDraw = () => {
	// Draw nothing
};
const defaultLoop = () => {
	// Do nothing EVERY FRAME
	return true;
};
const defaultReset = <TControlPanel extends ControlPanelConfig<any>, SketchData extends object>(
	props: SketchProps<TControlPanel>,
	data: SketchData,
): SketchData => {
	props.canvas.clear();
	return data;
};

export type SketchInputs<SketchParameters extends ControlPanelElements, SketchData extends object> = {
	config?: SketchConfigInput;
	controls: SketchParameters;
	init: SketchInit<SketchParameters, SketchData>;
	draw?: SketchDraw<SketchParameters, SketchData>;
	loop?: SketchLoop<SketchParameters, SketchData>;
	reset?: SketchReset<SketchParameters, SketchData>;
};

export function createSketch<SketchParameters extends ControlPanelElements, SketchData extends object>(
	definition: Identity<SketchInputs<SketchParameters, SketchData>>,
): SketchDefinition<SketchParameters, SketchData> {
	return {
		config: createSketchConfig(definition.config || {}),
		controls: definition.controls,
		init: definition.init,
		draw: definition.draw || defaultDraw,
		loop: definition.loop || defaultLoop,
		reset: definition.reset || defaultReset<ControlPanelConfig<SketchParameters>, SketchData>,
	};
}
