import React from 'react';
import styled from 'styled-components';

import ImageController from './ImageController';

import { MOBILE_WIDTH_BREAKPOINT } from '../../components/constants';
import { ParameterModel, SketchDefinition } from 'sketch/Sketch';

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

const Page = <PM extends ParameterModel, DataModel>({
  sketch,
}: {
  sketch: SketchDefinition<PM, DataModel>;
}) => {
  const canvasId = 'sketch-canvas';
  const downloaderId = 'canvas-downloader';

  return (
    <FullscreenWrapper>
      <ImageController
        sketch={sketch}
        canvasId={canvasId}
        downloaderId={downloaderId}
      />
      <CanvasWrapper>
        <ShadowFrameCanvas
          data-download="placeholder"
          id={canvasId}
          data-canvas-refresh={new Date().toISOString()}
        ></ShadowFrameCanvas>
      </CanvasWrapper>
      <a id={downloaderId} download=""></a>
    </FullscreenWrapper>
  );
};

export default Page;
