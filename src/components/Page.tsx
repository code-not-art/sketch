import React, { useEffect } from 'react';
import styled from 'styled-components';

import Sketch from '../sketch';

const FullscreenWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: #e2d1d9;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const CanvasWrapper = styled.div`
  padding: 50px;
`;

const ShadowFrameCanvas = styled.canvas`
  height: 100%;
  width: 100%;
  display: block;
  -webkit-box-shadow: 0px 0px 34px 4px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: 0px 0px 34px 4 rgba(0, 0, 0, 0.7);
  box-shadow: 0px 0px 34px 4px rgba(0, 0, 0, 0.7);
`;

const Page = (props: { sketch: Sketch }) => {
  let canvas: HTMLCanvasElement;

  // Event Handlers
  let windowResizeHandler: () => void;

  const resize = () => {
    const width = 2048;
    const height = 1024;
    const canvasAspectRatio = width / height;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowAspectRatio = windowWidth / windowHeight;

    let newHeight = height;
    let newWidth = width;

    // Always render the canvas within the dimensions of the window
    if (windowAspectRatio > canvasAspectRatio) {
      const maxDim = window.innerHeight - 50;
      if (height > maxDim) {
        newHeight = maxDim;
        newWidth = (newHeight / height) * width;
      }
    } else {
      const maxDim = window.innerWidth - 50;
      if (width > maxDim) {
        newWidth = maxDim;
        newHeight = (newWidth / width) * height;
      }
    }

    canvas.style.height = newHeight + 'px';
    canvas.style.width = newWidth + 'px';
  };

  // Page Load Effect
  useEffect(() => {
    // TODO: Log formatter
    console.log('Sketch Page Loading - Hello!');

    // Grab our canvas
    canvas = document.getElementById('sketch-canvas') as HTMLCanvasElement;

    // Set the canvas size, attach
    resize();
    if (!!windowResizeHandler) {
      // Due to hot reloading when running as dev it is possible to enter this effect multiple times, if so we want to remove the existing handler
      window.removeEventListener('resize', windowResizeHandler);
    }

    // event handlers should be defined as functions (not anonymous) so we can remove the event listeners in the future.
    windowResizeHandler = function () {
      resize();
    };
    window.addEventListener('resize', windowResizeHandler, true);
  }, []);
  return (
    <FullscreenWrapper>
      <CanvasWrapper>
        <ShadowFrameCanvas
          data-download="placeholder"
          id="sketch-canvas"
        ></ShadowFrameCanvas>
      </CanvasWrapper>
      <a id="canvas-downloader" download=""></a>
    </FullscreenWrapper>
  );
};

export default Page;
