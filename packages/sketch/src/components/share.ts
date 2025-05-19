import JSURL from 'jsurl';
import ImageState from './state/ImageState.js';

export const QUERY_STRING_COLOR_SEED = '_p';
export const QUERY_STRING_IMAGE_SEED = '_i';
export const QUERY_STRING_USER_COLOR_SEED = '_up';
export const QUERY_STRING_USER_IMAGE_SEED = '_ui';

export function buildQueryString(state: ImageState, params: Record<string, any>): string {
	return JSURL.stringify({
		...params,
		[QUERY_STRING_COLOR_SEED]: state.getColor(),
		[QUERY_STRING_IMAGE_SEED]: state.getImage(),
		[QUERY_STRING_USER_COLOR_SEED]: state.getUserColor(),
		[QUERY_STRING_USER_IMAGE_SEED]: state.getUserImage(),
	});
}

export function attachQueryStringToWindow(query: string) {
	const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + `?p=${query}#`;
	// Note the shameful hash at the end, this hacky workaround fixes issues on mobile URL parsers
	//  that exclude the trailing parenthesis in the URL. I'm looking at you, discord!
	window.history.pushState({ path: newUrl }, '', newUrl);
}

export function copyUrlToClipboard() {
	navigator.clipboard.writeText(window.location.href);
}

export function setUrlQueryFromState(state: ImageState, params: Record<string, any>): void {
	const paramsQuery = buildQueryString(state, params);
	attachQueryStringToWindow(paramsQuery);
}

/**
 * Use this to build the params, attach to location, and share
 * @param state
 * @param params
 */
export function shareViaUrl(state: ImageState, params: Record<string, any>) {
	setUrlQueryFromState(state, params);
	copyUrlToClipboard();
}

export function getParamsFromQuery(query: string) {
	return JSURL.parse(query);
}

export function applyQuery(query: string, state: ImageState, params: Record<string, any>) {
	const parsed = JSURL.parse(query);

	Object.assign(params, parsed);
	state.imageSeeds[0] = parsed._i;
	state.colorSeeds[0] = parsed._c;
	state.setActiveColor(0);
	state.restartRng();
}
