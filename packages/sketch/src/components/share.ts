import JSURL from 'jsurl';
import ImageState, { type ImageStateParams } from './state/ImageState.js';

export const QUERY_STRING_COLOR_SEED = '_c';
export const QUERY_STRING_IMAGE_SEED = '_i';
export const QUERY_STRING_COLOR_LOCKED = '_cl';
export const QUERY_STRING_IMAGE_LOCKED = '_il';
// Older links stored a seed the user typed here. Those seeds are read as locked seeds, and never written.
export const QUERY_STRING_LEGACY_USER_COLOR_SEED = '_up';
export const QUERY_STRING_LEGACY_USER_IMAGE_SEED = '_ui';

const SEED_QUERY_KEYS = [
	QUERY_STRING_COLOR_SEED,
	QUERY_STRING_IMAGE_SEED,
	QUERY_STRING_COLOR_LOCKED,
	QUERY_STRING_IMAGE_LOCKED,
	QUERY_STRING_LEGACY_USER_COLOR_SEED,
	QUERY_STRING_LEGACY_USER_IMAGE_SEED,
];

export function buildQueryString(state: ImageState, params: Record<string, any>): string {
	return JSURL.stringify({
		...params,
		[QUERY_STRING_COLOR_SEED]: state.getColor(),
		[QUERY_STRING_IMAGE_SEED]: state.getImage(),
		// Locks are only written when set, to keep links short
		[QUERY_STRING_COLOR_LOCKED]: state.colorLocked || undefined,
		[QUERY_STRING_IMAGE_LOCKED]: state.imageLocked || undefined,
	});
}

export function attachQueryStringToWindow(query: string) {
	const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + `?p=${query}#`;
	if (newUrl === window.location.href) {
		return;
	}
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

function parseQuery(query: string): Record<string, any> {
	const parsed = JSURL.parse(query);
	return typeof parsed === 'object' && parsed !== null ? parsed : {};
}

/**
 * Parses the parameter values from a share query, leaving out the seed and lock entries.
 */
export function getParamsFromQuery(query: string): Record<string, any> {
	const parsed = parseQuery(query);
	for (const key of SEED_QUERY_KEYS) {
		delete parsed[key];
	}
	return parsed;
}

/**
 * Parses the seeds and seed locks from a share query, in the form accepted by the `ImageState` constructor.
 */
export function getSeedsFromQuery(
	query: string,
): Pick<ImageStateParams, 'currentImageSeed' | 'currentColorSeed' | 'imageLocked' | 'colorLocked'> {
	const parsed = parseQuery(query);
	const legacyImage = parsed[QUERY_STRING_LEGACY_USER_IMAGE_SEED];
	const legacyColor = parsed[QUERY_STRING_LEGACY_USER_COLOR_SEED];
	return {
		currentImageSeed: legacyImage || parsed[QUERY_STRING_IMAGE_SEED] || undefined,
		currentColorSeed: legacyColor || parsed[QUERY_STRING_COLOR_SEED] || undefined,
		imageLocked: !!legacyImage || parsed[QUERY_STRING_IMAGE_LOCKED] === true,
		colorLocked: !!legacyColor || parsed[QUERY_STRING_COLOR_LOCKED] === true,
	};
}
