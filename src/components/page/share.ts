import JSURL from 'jsurl';
import StringMap from '../../utils/StringMap';
import ImageState from './ImageState';

export function buildQueryString(
  state: ImageState,
  params: StringMap<any>,
): string {
  return JSURL.stringify({
    ...params,
    _c: state.getColor(),
    _i: state.getImage(),
  });
}

export function attachQueryStringToWindow(query: string) {
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    `?p=${query}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

export function copyUrlToClipboard() {
  navigator.clipboard.writeText(window.location.href);
}

/**
 * Use this to build the params, attach to location, and share
 * @param state
 * @param params
 */
export function shareViaUrl(state: ImageState, params: StringMap<any>) {
  const paramsQuery = buildQueryString(state, params);
  attachQueryStringToWindow(paramsQuery);
  copyUrlToClipboard();
}

export function applyQuery(
  query: string,
  state: ImageState,
  params: StringMap<any>,
) {
  const parsed = JSURL.parse(query);

  Object.assign(params, parsed);
  state.imageSeeds[0] = parsed._i;
  state.colorSeeds[0] = parsed._c;
  state.setActiveColor(0);
}
