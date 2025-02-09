import { styled } from 'styled-components';

import type { ControlPanelElements } from '../control-panel/types/controlPanel.js';
import type { SketchDefinition } from '../sketch/Sketch.js';
import { MOBILE_WIDTH_BREAKPOINT } from './constants.js';
import { SketchController } from './SketchController.js';

const CanvasWrapper = styled.div`
	padding: 30px;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ShadowFrameCanvas = styled.canvas`
	height: 100%;
	width: 100%;
	display: block;
	-webkit-box-shadow: 0px 0px 34px 4px rgba(0, 0, 0, 0.7);
	-moz-box-shadow: 0px 0px 34px 4 rgba(0, 0, 0, 0.7);
	box-shadow: 0px 0px 34px 4px rgba(0, 0, 0, 0.7);
`;

export const SketchCanvas = <TParameters extends ControlPanelElements, DataModel extends object>({
	sketch,
	params,
}: // TODO: Styling for canvas
{
	sketch: SketchDefinition<TParameters, DataModel>;
	params?: Partial<DataModel>;
}) => {
	const canvasId = 'sketch-canvas';
	const downloaderId = 'canvas-downloader';

	return (
		<>
			<CanvasWrapper>
				<ShadowFrameCanvas id={canvasId}></ShadowFrameCanvas>
			</CanvasWrapper>
			<SketchController
				config={{ showControlPanel: false, enableControls: false }}
				initialParameters={params}
				sketch={sketch}
				canvasId={canvasId}
			/>
		</>
	);
};
