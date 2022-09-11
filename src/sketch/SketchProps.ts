import { Canvas, Random } from '@code-not-art/core';
import Palette from './Palette';

type SketchProps = {
  canvas: Canvas;
  palette: Palette;
  rng: Random;
  params: Record<string, any>;
  data: Record<string, any>;
};

export default SketchProps;
