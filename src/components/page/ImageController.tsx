import { Canvas, Color, Utils } from '@code-not-art/core';
import {
  get,
  isArray,
  isBoolean,
  isNumber,
  isObjectLike,
  isString,
} from 'lodash';
import querystring from 'query-string';
import React, { useEffect, useState } from 'react';
import { MOBILE_WIDTH_BREAKPOINT } from '../../components/constants.js';
import { ParameterType } from '../../sketch/Params.js';
import { ParameterModel, SketchDefinition } from '../../sketch/Sketch.js';
import { SketchProps } from '../../sketch/index.js';
import Menu from '../menu/index.js';
import { ImageState, LoopState } from '../state/index.js';
import KeyboardHandler from './KeyboardHandler.js';
import ControlButtons from './controls/index.js';
import { applyQuery } from './share.js';

type ImageControllerProps<
  Params extends ParameterModel,
  DataModel extends object,
> = {
  canvasId: string;
  downloaderId: string;
  sketch: SketchDefinition<Params, DataModel>;
};
const ImageController = <
  Params extends ParameterModel,
  DataModel extends object,
>({
  canvasId,
  downloaderId,
  sketch,
}: ImageControllerProps<Params, DataModel>) => {
  const config = sketch.config;

  // Mechanism for triggering react to render via a state change, used for getting our menus to redraw
  const [, updateState] = React.useState<{}>(new Date());
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [initialized, setInitialized] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const toggleMenu = () => setShowMenu(!showMenu);

  // All these state variables could just be local references, except they would get wiped during hotload.
  // By stashing them in state, they keep their values as the developer edits their sketch.
  const [state] = useState<ImageState>(
    new ImageState({ seed: config.seed, paletteType: config.paletteType }),
  );
  const [eventHandlers] = useState<any>({});
  const [params] = useState<Params>({ ...sketch.params });
  const [loopState] = useState<LoopState>(new LoopState());
  const [sketchData, setSketchData] = useState<DataModel>();

  const getSketchProps: () => SketchProps<Params> = () => {
    return {
      canvas: getCanvas(),
      params,
      rng: state.getRng(),
      palette: state.getPalette(),
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

  /**
   * Redraw triggers the sketch to run for every time after the initial draw
   * This runs the sketch.reset() code before the draw() function. It also restarts the animation loop.
   * The react state is forced to update to get the menu to re-render with the new sketch props.
   */
  const redraw = () => {
    const sketchProps = getSketchProps();
    if (!sketchData) {
      console.warn(
        `This code branch should not be visited regularly - this is emergency handling for a redraw before initial draw. Something may be going wrong if this is occuring on every draw.`,
      );
      const updatedSketchData = sketch.reset(
        sketchProps,
        sketch.init(sketchProps),
      );
      setSketchData(updatedSketchData);
    } else {
      const updatedSketchData = sketch.reset(sketchProps, sketchData);
      setSketchData(updatedSketchData);
    }

    // setting the initialized sketch data should result in forced use effect run, so commenting the followign out
    forceUpdate(); // will cause draw in the use effect
    loopState.restart();
  };

  const getCanvas = () => {
    // Grab our canvas
    const pageCanvas = document.getElementById(canvasId);
    if (pageCanvas instanceof HTMLCanvasElement) {
      return new Canvas(pageCanvas);
    }

    // We did not find a canvas where expected, throw an error instead.
    // TODO: System to communicate that the canvas was not available to the sketch.
    if (pageCanvas === null) {
      throw new Error(
        `Cannot render Sketch, Canvas with id '${canvasId}' is not found.`,
      );
    }
    throw new Error(
      `Cannot render Sketch, element with the expected id '${canvasId}' is not an HTML Canvas.`,
    );
  };

  const draw = () => {
    // Set dimensions for window
    resize();
    const sketchProps = getSketchProps();
    // Note: This size update is done pre-draw based on config props for the size.
    //      when this is run, the canvas bitmap content is lost, so do not do this in the resize loop.
    sketchProps.canvas.set.size(config.width, config.height);

    console.log(
      state.getImage(),
      '-',
      state.getColor(),
      Object.entries(params)
        .filter(([_key, value]) => value.type !== ParameterType.Header)
        .reduce<Record<string, any>>((acc, [key, value]) => {
          acc[key] = get(value, 'value', undefined);
          return acc;
        }, {}),
    );

    state.startRender();
    sketchData !== undefined && sketch.draw(getSketchProps(), sketchData);
    state.stopRender();

    if (loopState.animationFrameRequest) {
      window.cancelAnimationFrame(loopState.animationFrameRequest);
    }

    const animate = () => {
      if (loopState.nextFrame() && sketchData !== undefined) {
        loopState.finished = sketch.loop(
          getSketchProps(),
          sketchData,
          loopState.frameData,
        );
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
      KeyboardHandler({
        state,
        loopState,
        params,
        redraw,
        download,
        toggleMenu,
      })(event);
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
      redraw();
    };
    document.addEventListener('touchend', eventHandlers.touchend, false);
  };

  const controlPanelUpdateHandler = (
    property: string,
    value: any,
    _updatedState: Params,
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
        // This here is a terrible situation caused by a couple issues with the control panel library.
        // First, the control panel doesn't differentiate between display labels and property names,
        //   forcing us to identify the parameter by the display name
        // Second, the value returned is untyped (consequence of returning an)
        const param = Object.values(params).find((p) => p.display === property);
        if (param) {
          switch (param.type) {
            case ParameterType.Checkbox:
              if (isBoolean(value)) {
                param.value = value;
              }
              break;
            case ParameterType.Color:
              if (isString(value)) {
                param.value = new Color(value);
              }
              break;
            case ParameterType.Interval:
              if (
                isArray(value) &&
                value.length === 2 &&
                value.every((x) => isNumber(x))
              ) {
                param.values = value as [number, number];
              }
              break;
            case ParameterType.MultiSelect:
              if (
                isObjectLike(value) &&
                Object.values(value).every((x) => isBoolean(x))
              ) {
                param.values = value as Record<string, boolean>;
              }
              break;
            case ParameterType.Range:
              if (isNumber(value)) {
                param.value = Utils.clamp(value, param.options);
              }
              break;
            case ParameterType.Select:
              if (isString(value)) {
                param.value = value;
              }
              break;
            case ParameterType.Text:
              if (isString(value)) {
                param.value = value;
              }
              break;
            default:
              // do nothing, header param is the only uncontrolled case
              break;
          }
        }
        break;
    }
    redraw();
  };

  /**
   * Run on page load, hot reload, and every state update
   * This triggers draw, so forcing state update will cause the sketch to draw
   */
  useEffect(() => {
    // ===== Attach event handlers
    resetEventHandlers();

    // ===== Draw Sketch, only after initialization
    initialized && draw();

    // ===== Run once only
    if (!initialized) {
      console.log('### ===== Sketch! ===== ###');
      // ===== Initialize Sketch

      const query = querystring.parse(location.search);
      if (typeof query.p === 'string') {
        applyQuery(query.p, state, params);
      }

      resize();
      getCanvas().set.size(config.width, config.height);
      const initData = sketch.init(getSketchProps());
      setSketchData(initData);
      setInitialized(true);
    }
  });

  return (
    <>
      {showMenu && (
        <Menu
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
          draw={redraw}
          download={download}
          videoControls={!!sketch.config.enableLoopControls}
        />
      )}
    </>
  );
};

export default ImageController;
