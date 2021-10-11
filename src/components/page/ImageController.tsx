import React, { useEffect, useState } from 'react';
import querystring from 'query-string';

import { Canvas, Color } from '@code-not-art/core';

import { Sketch, SketchProps } from '../../sketch';
import KeyboardHandler from './KeyboardHandler';
import ImageState from './ImageState';
import ControlButtons from './controls';

import Menu from '../menu';
import StringMap from 'utils/StringMap';
import LoopState from './LoopState';
import { MOBILE_WIDTH_BREAKPOINT } from '../../components/constants';

import { applyQuery } from './share';
import { ParameterType } from '../../sketch/Params';

type ImageControllerProps = {
  canvasId: string;
  downloaderId: string;
  sketch: ReturnType<typeof Sketch>;
};
const ImageController = ({
  canvasId,
  downloaderId,
  sketch,
}: ImageControllerProps) => {
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
  const [state] = useState<ImageState>(new ImageState(config.seed));
  const [eventHandlers] = useState<any>({});
  const [params] = useState<StringMap<any>>(convertSketchParameters());
  const [loopState] = useState<LoopState>(new LoopState());
  const [sketchData] = useState<StringMap<any>>({});

  const [redraws, setRedraws] = useState<number>(0);
  const triggerRedraw = () => {
    setRedraws(redraws + 1);
  };

  const getTypeCorrectedProps = () => {
    const output = { ...params };
    sketch.params.forEach((originalParam) => {
      switch (originalParam.type) {
        case ParameterType.Color:
          output[originalParam.key] = new Color(params[originalParam.key]);
          break;
        case ParameterType.MultiSelect:
          const value: StringMap<boolean> = {};
          const updatedBooleans: boolean[] = params[originalParam.key];
          Object.keys(originalParam.multiSelectValues || []).forEach(
            (key, index) => (value[key] = updatedBooleans[index]),
          );
          output[originalParam.key] = value;
          break;
        default:
        // Do nothing
      }
    });
    return output;
  };

  const getSketchProps: () => SketchProps = () => {
    return {
      canvas: getCanvas(),
      params: getTypeCorrectedProps(),
      rng: state.getImageRng(),
      palette: state.getPalette(),
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
    triggerRedraw();
    loopState.restart();
  };

  const getCanvas = () => {
    // Grab our canvas
    const pageCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
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
    console.log(state.getImage(), '-', state.getColor(), params);

    state.startRender();
    sketch.draw(getSketchProps());
    state.stopRender();

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
    const downloadLink = document.getElementById(downloaderId);
    if (downloadLink) {
      const image = getCanvas().canvas.toDataURL('image/png');
      downloadLink.setAttribute('href', image);
      downloadLink.setAttribute('download', saveas);
      downloadLink.click();
    }
  };

  // ===== Event Handlers =====
  // They all need to be removed before being re-attached or crazy duplicates happen
  // They also need to be reattached when the params change since the original listeners have those params in their internal scope
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
        params,
        triggerRedraw,
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
      triggerRedraw();
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
    triggerRedraw();
  };

  /**
   * Run with every page load and again on hot load
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

      const query = querystring.parse(location.search);
      if (typeof query.p === 'string') {
        applyQuery(query.p, state, params);
      }

      resize();
      getCanvas().set.size(config.width, config.height);
      sketch.init(getSketchProps());

      setInitialized(true);
    }
  });

  return (
    <>
      {showMenu && (
        <Menu
          sketchParameters={sketch.params}
          params={params}
          updateHandler={controlPanelUpdateHandler}
          debounce={config.menuDelay}
          imageState={state}
        />
      )}
      {window.innerWidth <= MOBILE_WIDTH_BREAKPOINT && (
        <ControlButtons
          state={state}
          loopState={loopState}
          params={params}
          draw={triggerRedraw}
          download={download}
          videoControls={sketch.config.loopControls}
        />
      )}
    </>
  );
};

export default ImageController;
