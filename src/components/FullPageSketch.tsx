import { styled } from 'styled-components';

import { SketchDefinition } from 'sketch/index.js';
import type { ControlPanelElement } from '../control-panel/types/controlPanel.js';
import { MOBILE_WIDTH_BREAKPOINT } from './constants.js';
import { SketchController } from './SketchController.js';

const FullscreenWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: #888;

  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: ${MOBILE_WIDTH_BREAKPOINT}px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

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

export const FullPageSketch = <
  TParameters extends Record<string, ControlPanelElement<any>>,
  DataModel extends object,
>({
  sketch,
}: {
  sketch: SketchDefinition<TParameters, DataModel>;
}) => {
  const canvasId = 'sketch-canvas';
  const downloaderId = 'canvas-downloader';

  return (
    <FullscreenWrapper>
      <CanvasWrapper>
        <ShadowFrameCanvas
          data-download="placeholder"
          id={canvasId}
          data-canvas-refresh={new Date().toISOString()}
        ></ShadowFrameCanvas>
      </CanvasWrapper>
      <SketchController
        sketch={sketch}
        canvasId={canvasId}
        downloaderId={downloaderId}
      />
      <a id={downloaderId} download=""></a>
    </FullscreenWrapper>
  );
};
