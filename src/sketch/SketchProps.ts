import { Canvas, Random } from '@code-not-art/core';
import type {
  ControlPanelConfig,
  ControlPanelParameterValues,
} from '../control-panel/types/controlPanel.js';
import Palette from './Palette/index.js';

export type SketchProps<TControlPanel extends ControlPanelConfig<any>> = {
  canvas: Canvas;
  palette: Palette;
  params: ControlPanelParameterValues<TControlPanel>;
  rng: Random;
};
