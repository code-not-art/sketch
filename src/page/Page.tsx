import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Canvas } from '@code-not-art/core';

import Sketch from '../sketch';
import KeyboardHandler from './KeyboardHandler';
import PageState from './PageState';

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
  const sketch = props.sketch;
  const config = sketch.config;

  let canvas: Canvas;

  const state = new PageState(config.seed);

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
    canvas.set.size(config.width, config.height);
  };

  const redraw = () => {
    resize();
    console.log(state.getImage(), '-', state.getColor());
    props.sketch.init({
      canvas,
      rng: state.getImageRng(),
      colorRng: state.getColorRng(),
    });
    props.sketch.draw({
      canvas,
      rng: state.getImageRng(),
      colorRng: state.getColorRng(),
    });
  };

  const regenerate = () => {
    redraw();
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
  const eventHandlers: any = {};
  const keyboardHandler = KeyboardHandler(sketch, state, regenerate, download);

  const resetEventHandlers = () => {
    // ===== Remove existing handlers to handle hotloading duplication
    if (!!eventHandlers.resize) {
      window.removeEventListener('resize', eventHandlers.resize);
    }
    if (!!eventHandlers.keydown) {
      window.removeEventListener('keydown', eventHandlers.keydown);
    }

    // ===== Create Functions to attach to event handlers
    eventHandlers.resize = function () {
      resize();
    };
    eventHandlers.keydown = function (event: KeyboardEvent) {
      keyboardHandler(event);
    };

    // ===== Attach Event handlers to events
    window.addEventListener('resize', eventHandlers.resize, true);
    window.addEventListener('keydown', eventHandlers.keydown, false);
  };

  // Page Load Effect
  useEffect(() => {
    // TODO: Log formatter
    console.log('Sketch Page Loading - Hello!');

    // Grab our canvas
    const pageCanvas = document.getElementById(
      'sketch-canvas',
    ) as HTMLCanvasElement;
    canvas = new Canvas(pageCanvas);

    // Set dimensions for window
    resize();

    // Attach event handlers
    resetEventHandlers();

    // Initial draw
    redraw();
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
