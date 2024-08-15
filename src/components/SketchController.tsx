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
import {
  ParameterModel,
  ParameterType,
  Params,
  SketchDefinition,
  SketchProps,
} from '../sketch/index.js';
import KeyboardHandler from './KeyboardHandler.js';
import { MOBILE_WIDTH_BREAKPOINT } from './constants.js';
import ControlButtons from './controls/index.js';
import { applyQuery } from './share.js';
import { ImageState, LoopState } from './state/index.js';
import type {
  ControlPanelConfig,
  ControlPanelParameterValues,
} from '../control-panel/types/controlPanel.js';
import {
  initialControlPanelValues,
  Parameters,
} from '../control-panel/Parameters.js';
import { ControlPanel } from '../control-panel/ControlPanel.js';
import { ControlPanelDisplay } from './control-panel/ControlPanelDisplay.js';

type SketchControllerProps<
  TControlPanel extends ControlPanelConfig<any>,
  TDataModel extends object,
> = {
  canvasId: string;
  downloaderId: string;
  sketch: SketchDefinition<TControlPanel, TDataModel>;
};
export const SketchController = <
  TControlPanel extends ControlPanelConfig<any>,
  TDataModel extends object,
>({
  canvasId,
  downloaderId,
  sketch,
}: SketchControllerProps<
  ControlPanelParameterValues<TControlPanel>,
  TDataModel
>) => {
  const config = sketch.config;

  // Mechanism for triggering react to render via a state change, used for getting our menus to redraw
  // const [, updateState] = React.useState<{}>(new Date());
  // const forceUpdate = React.useCallback(() => updateState({}), []);

  const [initialized, setInitialized] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const toggleMenu = () => setShowMenu(!showMenu);

  // All these state variables could just be local references, except they would get wiped during hotload.
  // By stashing them in state, they keep their values as the developer edits their sketch.
  const [state] = useState<ImageState>(
    new ImageState({ seed: config.seed, paletteType: config.paletteType }),
  );

  const controlsConfig = ControlPanel('Make Code Not Art', {
    state: ControlPanel('Current Sketch', {
      image: Parameters.string({
        label: 'Image Seed',
        initialValue: state.getImage(),
        editable: false,
      }),
      color: Parameters.string({
        label: 'Colors Seed',
        initialValue: state.getColor(),
        editable: false,
      }),
    }),
    customSeeds: ControlPanel('Current Sketch', {
      image: Parameters.string({
        label: 'Image Seed',
      }),
      color: Parameters.string({
        label: 'Colors Seed',
      }),
    }),
    sketch: sketch.controls || ControlPanel('Custom Controls', {}),
  });
  type SketchParams = ControlPanelParameterValues<TControlPanel>;
  type ControlValues = ControlPanelParameterValues<typeof controlsConfig>;

  // const standardParams = {
  //   seedsHeader: Params.header('Custom Seeds'),
  //   image: Params.text('image', ''),
  //   color: Params.text('color', ''),
  // };
  // TODO: Next Step! combine with sketch parameters and provide to control panel hook, use the setState function from this hook to pass to control panel

  const [eventHandlers] = useState<any>({});
  const [params, _setParams] = useState<ControlValues>(
    initialControlPanelValues(controlsConfig),
  );
  const [loopState] = useState<LoopState>(new LoopState());

  const forceUpdate = () => {
    const updatedParams = { ...params };
    updatedParams.state.image = state.getImage();
    updatedParams.state.color = state.getColor();
    _setParams(updatedParams);
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

  const getSketchProps: () => SketchProps<SketchParams> = () => {
    return {
      canvas: getCanvas(),
      params: params.sketch,
      rng: state.getRng(),
      palette: state.getPalette(),
    };
  };

  const [sketchData] = useState<{ data: TDataModel | undefined }>({
    data: undefined,
  });
  const setSketchData = (data: TDataModel) => {
    sketchData.data = data;
  };
  const getSketchData = (): TDataModel => {
    const { data } = sketchData;
    if (data !== undefined) {
      return data;
    }
    const freshData = sketch.reset(getSketchProps());
    setSketchData(freshData);
    return freshData;
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

    const updatedSketchData = sketch.reset(sketchProps);
    setSketchData(updatedSketchData);

    forceUpdate(); // will cause draw in the use effect
    loopState.restart();
  };

  const draw = () => {
    // Set dimensions for window
    resize();
    const sketchProps = getSketchProps();
    // Note: This size update is done pre-draw based on config props for the size.
    //      when this is run, the canvas bitmap content is lost, so do not do this in the resize loop.
    sketchProps.canvas.set.size(config.width, config.height);

    console.log(
      'Draw sketch with state:',
      state.getImage(),
      '-',
      state.getColor(),
      params,
    );

    state.startRender();
    sketchData !== undefined && sketch.draw(getSketchProps(), getSketchData());
    state.stopRender();

    if (loopState.animationFrameRequest) {
      window.cancelAnimationFrame(loopState.animationFrameRequest);
    }

    const animate = () => {
      if (loopState.nextFrame()) {
        loopState.finished = sketch.loop(
          getSketchProps(),
          getSketchData(),
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
    updates: Partial<ControlValues>,
    newValues: ControlValues,
  ) => {
    if (updates.customSeeds !== undefined) {
      Object.entries(updates.customSeeds).forEach(([key, value]) => {
        switch (key) {
          case 'image': {
            state.setUserImage(value);
            break;
          }
          case 'color': {
            state.setUserColor(value);
            break;
          }
        }
      });
    }
    params.state = newValues.state;
    params.customSeeds = newValues.customSeeds;
    params.sketch = newValues.sketch;
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
      {/* {showMenu && (
        <Menu
          params={params}
          updateHandler={controlPanelUpdateHandler}
          debounce={config.menuDelay}
          imageState={state}
        />
      )} */}
      <ControlPanelDisplay
        config={controlsConfig}
        values={params}
        updateHandler={controlPanelUpdateHandler}
      />
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
