import { Canvas, Random } from '@code-not-art/core';
import StringMap from 'types/StringMap';
import Palette from './Palette';

type SketchProps = {
  canvas: Canvas;
  palette: Palette;
  rng: Random;
  params: StringMap<any>;
  data: StringMap<any>;
};

export default SketchProps;
