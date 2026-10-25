import type { Values } from '../types/common.js';
import { clamp, wrap } from '../utils/index.js';

/**
 * A color in the RGB color space.
 * Red, green and blue are from 0 to 255, alpha is from 0 to 1.
 */
export type Rgba = { r: number; g: number; b: number; a: number };

/**
 * A color in the HSV color space.
 * Hue is from 0 up to (but not including) 360, saturation and value are from 0 to 100, alpha is from 0 to 1.
 */
export type Hsva = { h: number; s: number; v: number; a: number };

/**
 * Directions that hue can travel around the hue circle when mixing two HSV colors with `mixHsva`.
 *
 * - `Short`: travel the shorter way around the circle, which is never more than 180 degrees.
 * - `Long`: travel the longer way around the circle.
 * - `Down`: always travel in the direction of decreasing hue, wrapping from 0 to 360 when needed.
 * - `Up`: always travel in the direction of increasing hue, wrapping from 360 to 0 when needed.
 */
export const HueMixingModes = {
	Short: 'SHORT',
	Long: 'LONG',
	Down: 'DOWN',
	Up: 'UP',
} as const;
export type HueMixingMode = Values<typeof HueMixingModes>;

/**
 * Fit an HSV color into the valid range of each channel.
 * Hue wraps around the hue circle (so 370 becomes 10 and -30 becomes 330), saturation, value and alpha are clamped.
 * Returns a new object, the input is not modified.
 */
export function normalizeHsva(hsva: Hsva): Hsva {
	return {
		h: wrap(hsva.h, { max: 360 }),
		s: clamp(hsva.s, { min: 0, max: 100 }),
		v: clamp(hsva.v, { min: 0, max: 100 }),
		a: clamp(hsva.a),
	};
}

/**
 * Convert an RGB color to HSV.
 * The result is not rounded, so converting back with `hsvaToRgba` returns the original channels
 * (to within floating point error). Input channels are not clamped.
 */
export function rgbaToHsva(rgba: Rgba): Hsva {
	const red = rgba.r / 255;
	const green = rgba.g / 255;
	const blue = rgba.b / 255;
	const max = Math.max(red, green, blue);
	const delta = max - Math.min(red, green, blue);

	let hue = 0;
	if (delta !== 0) {
		if (max === red) {
			hue = ((green - blue) / delta) % 6;
		} else if (max === green) {
			hue = (blue - red) / delta + 2;
		} else {
			hue = (red - green) / delta + 4;
		}
	}

	return normalizeHsva({ h: hue * 60, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100, a: rgba.a });
}

/**
 * Convert an HSV color to RGB.
 * The channels returned are not rounded to whole numbers.
 * Out of range input is normalized first: hue wraps around the hue circle, the other channels are clamped.
 */
export function hsvaToRgba(hsva: Hsva): Rgba {
	const { h, s, v, a } = normalizeHsva(hsva);
	const chroma = (v / 100) * (s / 100);
	const hueSector = h / 60;
	const secondary = chroma * (1 - Math.abs((hueSector % 2) - 1));
	const offset = v / 100 - chroma;

	let red = 0;
	let green = 0;
	let blue = 0;
	if (hueSector < 1) {
		[red, green, blue] = [chroma, secondary, 0];
	} else if (hueSector < 2) {
		[red, green, blue] = [secondary, chroma, 0];
	} else if (hueSector < 3) {
		[red, green, blue] = [0, chroma, secondary];
	} else if (hueSector < 4) {
		[red, green, blue] = [0, secondary, chroma];
	} else if (hueSector < 5) {
		[red, green, blue] = [secondary, 0, chroma];
	} else {
		[red, green, blue] = [chroma, 0, secondary];
	}

	return { r: (red + offset) * 255, g: (green + offset) * 255, b: (blue + offset) * 255, a };
}

/**
 * Mix two RGB colors by averaging each channel.
 * @param ratio the proportion of the first color, from 0 to 1, with the remainder taken from the second color.
 * Values outside this range are clamped. Defaults to 0.5, an equal mix.
 */
export function mixRgba(first: Rgba, second: Rgba, ratio: number = 0.5): Rgba {
	const clampedRatio = clamp(ratio);
	const mixChannel = (firstValue: number, secondValue: number): number =>
		firstValue * clampedRatio + secondValue * (1 - clampedRatio);

	return {
		r: mixChannel(first.r, second.r),
		g: mixChannel(first.g, second.g),
		b: mixChannel(first.b, second.b),
		a: mixChannel(first.a, second.a),
	};
}

/**
 * Signed number of degrees to travel from one hue to another when moving in the given mode.
 */
function hueTravel(from: number, to: number, mode: HueMixingMode): number {
	const up = wrap(to - from, { max: 360 }); // 0 to 360, distance travelled going up
	const down = up === 0 ? 0 : up - 360; // -360 to 0, distance travelled going down
	switch (mode) {
		case HueMixingModes.Up:
			return up;
		case HueMixingModes.Down:
			return down;
		case HueMixingModes.Long:
			return up > 180 ? up : down;
		case HueMixingModes.Short:
			return up > 180 ? down : up;
	}
}

/**
 * Mix two HSV colors by averaging each channel. Hue moves around the hue circle in the direction set by the hue
 * mixing mode, wrapping at 360.
 * @param ratio the proportion of the first color, from 0 to 1, with the remainder taken from the second color.
 * Values outside this range are clamped. Defaults to 0.5, an equal mix.
 * @param options.hueMixingMode the direction hue travels between the two colors. Defaults to `SHORT`, the shorter way
 * around.
 */
export function mixHsva(
	first: Hsva,
	second: Hsva,
	ratio: number = 0.5,
	options: { hueMixingMode?: HueMixingMode } = {},
): Hsva {
	const clampedRatio = clamp(ratio);
	const { hueMixingMode = HueMixingModes.Short } = options;
	const mixChannel = (firstValue: number, secondValue: number): number =>
		firstValue * clampedRatio + secondValue * (1 - clampedRatio);

	return {
		h: wrap(first.h + hueTravel(first.h, second.h, hueMixingMode) * (1 - clampedRatio), { max: 360 }),
		s: mixChannel(first.s, second.s),
		v: mixChannel(first.v, second.v),
		a: mixChannel(first.a, second.a),
	};
}
