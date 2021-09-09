import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Canvas } from '@code-not-art/core';

import Sketch from '../../sketch';
import KeyboardHandler from './KeyboardHandler';
import PageState from './PageState';
import Palette from '../../sketch/Palette';

import Menu from '../menu';
import StringMap from 'types/StringMap';

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
  // Expand inputs for convenience
  const sketch = props.sketch;
  const config = sketch.config;

  // Converter needed to initialize state
  const convertSketchParameters = () => {
    const output: StringMap<any> = {};
    sketch.params.forEach((p) => {
      output[p.key] = p.value;
    });
    return output;
  };

  const [initialized, setInitialized] = useState<boolean>(false);
  const [state] = useState<PageState>(new PageState(config.seed));
  const [eventHandlers] = useState<any>({});
  const [params] = useState<StringMap<any>>(convertSketchParameters());

  let canvas: Canvas;

  const resize = () => {
    const canvasAspectRatio = config.width / config.height;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowAspectRatio = windowWidth / windowHeight;

    let newHeight = config.height;
    let newWidth = config.width;

    // Always render the canvas within the dimensions of the window
    if (windowAspectRatio > canvasAspectRatio) {
      const maxDim = window.innerHeight - 50;
      if (config.height > maxDim) {
        newHeight = maxDim;
        newWidth = (newHeight / config.height) * config.width;
      }
    } else {
      const maxDim = window.innerWidth - 50;
      if (config.width > maxDim) {
        newWidth = maxDim;
        newHeight = (newWidth / config.width) * config.height;
      }
    }
    canvas.canvas.style.height = newHeight + 'px';
    canvas.canvas.style.width = newWidth + 'px';
  };

  const draw = () => {
    // Grab our canvas
    const pageCanvas = document.getElementById(
      'sketch-canvas',
    ) as HTMLCanvasElement;
    canvas = new Canvas(pageCanvas);
    // updateSketchProps();

    // Set dimensions for window
    resize();

    // Note: This size update is done pre-draw based on config props for the size.
    //      when this is run, the canvas bitmap content is lost, so do not do this in the resize loop.
    canvas.set.size(config.width, config.height);

    // TODO: Improve the state logging.
    console.log(state.getImage(), '-', state.getColor());
    props.sketch.draw({
      canvas,
      params,
      rng: state.getImageRng(),
      palette: new Palette(state.getColorRng()),
    });
  };

  const download = () => {
    const saveas = `${state.getImage()} - ${state.getColor()}.png`;
    const downloadLink = document.getElementById('canvas-downloader');
    if (downloadLink) {
      const image = canvas.canvas.toDataURL('image/png');
      downloadLink.setAttribute('href', image);
      downloadLink.setAttribute('download', saveas);
      downloadLink.click();
    }
  };

  // ===== Event Handlers =====
  const setEventHandlers = () => {
    // ===== Window Resize
    eventHandlers.resize = function () {
      resize();
    };
    window.addEventListener('resize', eventHandlers.resize, true);

    // ===== Keydown
    eventHandlers.keydown = (event: KeyboardEvent) => {
      KeyboardHandler(state, draw, download)(event);
    };
    document.addEventListener('keydown', eventHandlers.keydown, false);
  };

  const controlPanelUpdateHandler = (
    property: string,
    value: any,
    updatedState: StringMap<any>,
  ) => {
    params[property] = value;
    draw();
    // regenerate();
  };

  /**
   * Run once on page load
   */
  useEffect(() => {
    // ===== Draw Sketch
    initialized && draw();

    // ===== Run once only!
    if (!initialized) {
      console.log('### ===== Sketch! ===== ###');
      // ===== Initialize Sketch
      sketch.init({
        canvas,
        params,
        rng: state.getImageRng(),
        palette: new Palette(state.getColorRng()),
      });
      // ===== Attach event handlers
      setEventHandlers();

      setInitialized(true);
    }
  });

  return (
    <FullscreenWrapper>
      <Menu
        sketchParameters={sketch.params}
        params={params}
        updateHandler={controlPanelUpdateHandler}
      />
      <CanvasWrapper>
        <ShadowFrameCanvas
          data-download="placeholder"
          id="sketch-canvas"
          data-canvas-refresh={new Date().toISOString()}
        ></ShadowFrameCanvas>
      </CanvasWrapper>
      <a id="canvas-downloader" download=""></a>
    </FullscreenWrapper>
  );
};

export default Page;
