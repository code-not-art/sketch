import JSURL from 'jsurl';
import StringMap from '../../utils/StringMap';
import ImageState from './ImageState';

export function buildQuery(state: ImageState, params: StringMap<any>): string {
  return JSURL.stringify({
    ...params,
    _color: state.getColor(),
    _image: state.getImage(),
  });
}

export function applyQuery(
  query: string,
  state: ImageState,
  params: StringMap<any>,
) {
  const parsed = JSURL.parse(query);

  Object.assign(params, parsed);
  state.imageSeeds[0] = parsed._image;
  state.colorSeeds[0] = parsed._color;
}
