import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Canvas } from '@code-not-art/core';

import { Sketch, Palette, SketchProps } from '../../sketch';
import KeyboardHandler from './KeyboardHandler';
import PageState from './PageState';

import Menu from '../menu';
import StringMap from 'utils/StringMap';
import LoopState from './LoopState';
import { MOBILE_WIDTH_BREAKPOINT } from '../../components/constants';

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

const Page = (props: { sketch: ReturnType<typeof Sketch> }) => {
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
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const toggleMenu = () => setShowMenu(!showMenu);

  // All these state variables could just be local references, except they would get wiped during hotload
  //  by stashing them in state, they keep their values as the user edits their sketch
  //  Some of the classes used here (PageState) could be managed in the Page react state, but this was a
  //  convenient way of separating the code
  const [state] = useState<PageState>(new PageState(config.seed));
  const [eventHandlers] = useState<any>({});
  const [params] = useState<StringMap<any>>(convertSketchParameters());
  const [loopState] = useState<LoopState>(new LoopState());
  const [sketchData] = useState<StringMap<any>>({});

  const getSketchProps: () => SketchProps = () => {
    return {
      canvas: getCanvas(),
      params,
      rng: state.getImageRng(),
      palette: new Palette(state.getColorRng()),
      data: sketchData,
    };
  };

  const resize = () => {
    const canvasAspectRatio = config.width / config.height;

    // For quick mobile sizing solution:
    const useHalfScreen = window.innerWidth <= MOBILE_WIDTH_BREAKPOINT;

    const windowWidth = window.innerWidth;
    const windowHeight = useHalfScreen
      ? window.innerHeight / 2
      : window.innerHeight;
    const windowAspectRatio = windowWidth / windowHeight;

    let newHeight = config.height;
    let newWidth = config.width;

    // Always render the canvas within the dimensions of the window
    if (windowAspectRatio > canvasAspectRatio) {
      const maxDim = windowHeight - 30;
      if (config.height > maxDim) {
        newHeight = maxDim;
        newWidth = (newHeight / config.height) * config.width;
      }
    } else {
      const maxDim = windowWidth - 30;
      if (config.width > maxDim) {
        newWidth = maxDim;
        newHeight = (newWidth / config.width) * config.height;
      }
    }
    const canvas = getCanvas();
    canvas.canvas.style.height = newHeight + 'px';
    canvas.canvas.style.width = newWidth + 'px';
  };

  const restart = () => {
    const sketchProps = getSketchProps();
    sketch.reset(sketchProps);
    sketch.init(sketchProps);
    draw();
    loopState.restart();
  };

  const getCanvas = () => {
    // Grab our canvas
    const pageCanvas = document.getElementById(
      'sketch-canvas',
    ) as HTMLCanvasElement;
    return new Canvas(pageCanvas);
  };

  const draw = () => {
    // Set dimensions for window
    resize();
    const sketchProps = getSketchProps();
    // Note: This size update is done pre-draw based on config props for the size.
    //      when this is run, the canvas bitmap content is lost, so do not do this in the resize loop.
    sketchProps.canvas.set.size(config.width, config.height);

    // TODO: Improve the state logging.
    console.log(state.getImage(), '-', state.getColor());

    sketch.draw(getSketchProps());

    if (loopState.animationFrameRequest) {
      window.cancelAnimationFrame(loopState.animationFrameRequest);
    }

    const animate = () => {
      if (loopState.nextFrame()) {
        loopState.finished = sketch.loop(getSketchProps(), loopState.frameData);
      }
      loopState.animationFrameRequest = window.requestAnimationFrame(animate);
    };
    animate();
  };

  const download = () => {
    const saveas = `${state.getImage()} - ${state.getColor()}.png`;
    const downloadLink = document.getElementById('canvas-downloader');
    if (downloadLink) {
      const image = getCanvas().canvas.toDataURL('image/png');
      downloadLink.setAttribute('href', image);
      downloadLink.setAttribute('download', saveas);
      downloadLink.click();
    }
  };

  // ===== Event Handlers =====
  const resetEventHandlers = () => {
    // ===== Window Resize
    window.removeEventListener('resize', eventHandlers.resize);
    eventHandlers.resize = function () {
      resize();
    };
    window.addEventListener('resize', eventHandlers.resize, true);

    // ===== Keydown
    document.removeEventListener('keydown', eventHandlers.keydown);
    eventHandlers.keydown = (event: KeyboardEvent) => {
      KeyboardHandler(
        state,
        loopState,
        draw,
        restart,
        download,
        toggleMenu,
      )(event);
    };
    document.addEventListener('keydown', eventHandlers.keydown, false);

    // ===== Touch Screen Press on Canvas
    document.removeEventListener('touchend', eventHandlers.touchend);

    eventHandlers.touchend = (event: TouchEvent) => {
      if (
        event.target &&
        (event.target as HTMLElement).localName !== 'canvas'
      ) {
        // Ignore any touch not on the canvas
        return;
      }
      state.random();
      draw();
    };
    document.addEventListener('touchend', eventHandlers.touchend, false);
  };

  const controlPanelUpdateHandler = (
    property: string,
    value: any,
    // updatedState: StringMap<any>,
  ) => {
    // The menu provides two special inputs for 'image' and 'color'
    //  which we want to use on the user provided image and color seeds
    // Every other property gets set in the Params defined by the sketch.
    switch (property) {
      case 'image':
        state.setUserImage(value);
        break;
      case 'color':
        state.setUserColor(value);
        break;
      default:
        params[property] = value;
        break;
    }
    draw();
  };

  /**
   * Run once on page load
   */
  useEffect(() => {
    // ===== Attach event handlers
    resetEventHandlers();

    // ===== Draw Sketch
    initialized && draw();

    // ===== Run once only!
    if (!initialized) {
      console.log('### ===== Sketch! ===== ###');
      // ===== Initialize Sketch
      resize();
      getCanvas().set.size(config.width, config.height);
      sketch.init(getSketchProps());

      setInitialized(true);
    }
  });

  return (
    <FullscreenWrapper>
      {showMenu && (
        <Menu
          sketchParameters={sketch.params}
          params={params}
          updateHandler={controlPanelUpdateHandler}
          debounce={config.menuDelay}
        />
      )}
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
