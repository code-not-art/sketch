import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Canvas } from '@code-not-art/core';

import Sketch from '../../sketch';
import KeyboardHandler from './KeyboardHandler';
import PageState from './PageState';
import Palette from '../../sketch/Palette';
import SketchProps from '../../sketch/SketchProps';

import Menu from '../menu';

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
  let sketchProps: SketchProps;

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
  };

  const updateSketchProps = () => {
    sketchProps = {
      canvas,
      rng: state.getImageRng(),
      palette: new Palette(state.getColorRng()),
    };
  };

  const draw = () => {
    // Note: This size update is done pre-draw based on config props for the size.
    //      when this is run, the canvas bitmap content is lost, so do not do this in the resize loop.
    canvas.set.size(config.width, config.height);

    // TODO: Improve the state logging.
    console.log(state.getImage(), '-', state.getColor());
    props.sketch.draw({
      canvas,
      rng: state.getImageRng(),
      palette: new Palette(state.getColorRng()),
    });
  };

  const regenerate = () => {
    // Reset, generate the new sketch props, draw
    sketch.reset(sketchProps);
    updateSketchProps();
    draw();
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
  const keyboardHandler = KeyboardHandler(state, regenerate, download);

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

    // Initialize SketchProps
    updateSketchProps();

    // Initial draw
    props.sketch.init(sketchProps);
    draw();
  }, []);
  return (
    <FullscreenWrapper>
      <Menu params={{}} />
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
