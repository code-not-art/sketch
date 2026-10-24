import tinycolor from 'tinycolor2';

import { Random } from '../random/index.js';
import type { Values } from '../types/common.js';
import { clamp } from '../utils/index.js';

/**
 * Directions that hue can travel around the hue circle when mixing two colors with `Color.mixHsv`.
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
 * Signed number of degrees to travel from one hue to another when moving in the given mode.
 */
function hueTravel(from: number, to: number, mode: HueMixingMode): number {
	const up = (((to - from) % 360) + 360) % 360; // 0 to 360, distance travelled going up
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

class Color {
	seed;
	private _color;

	/**
	 * @param options
	 * h = hue, is 1 to 360 - default: random
	 *
	 * s = saturation, is 1 to 100 - default: random
	 *
	 * v = value, is 1 to 100 - default: random
	 *
	 * a = alpha, is 0 to 1 - default: 1
	 *
	 * seed = any string - default: random
	 *
	 * rng = existing Random generator - default: new Random generator based on the seed value
	 */
	constructor(
		options?:
			| {
					h?: number;
					s?: number;
					v?: number;
					a?: number;
					seed?: string;
					rng?: Random;
			  }
			| string,
	) {
		if (options === undefined) {
			this.seed = new Random(`Random Color Seed`).next().toString();
			const _rng = new Random(`Color ${this.seed}`, this.seed);
			const hsv = `hsva(${_rng.float(1, 360)}, ${_rng.float(0, 100)}%, ${_rng.float(0, 100)}%, 1)`;
			this._color = tinycolor(hsv);
		} else if (typeof options === 'string') {
			this._color = tinycolor(options);
		} else {
			this.seed = options.seed ?? new Random(`Random Color Seed`).next().toString();
			const _rng = options.rng ?? new Random(`Color ${this.seed}`, this.seed);

			const _h = options.h ?? _rng.float(0, 360);
			const _s = options.s ?? _rng.float(0, 100);
			const _v = options.v ?? _rng.float(0, 100);
			const _a = options.a ?? 1;
			const hsv = `hsva(${clamp(_h, { min: 0, max: 360 })}, ${clamp(_s, {
				min: 0,
				max: 100,
			})}%, ${clamp(_v, { min: 0, max: 100 })}%, ${clamp(_a)})`;
			this._color = tinycolor(hsv);
		}
	}

	rgb() {
		return this._color.toRgbString();
	}

	get = {
		alpha: () => this._color.getAlpha(),
		rgb: () => this._color.toRgb(),
		hex: () => this._color.toHex(),
		hsv: () => this._color.toHsv(),
	};

	set = {
		rgb: (r: number, g: number, b: number): Color => {
			this._color = tinycolor({ a: this._color.getAlpha(), r, g, b });
			return this;
		},
		hex: (value: string): Color => {
			const alpha = this._color.getAlpha();
			this._color = tinycolor(value);
			this._color.setAlpha(alpha);
			return this;
		},
		hsv: (h: number, s: number, v: number): Color => {
			const hsva = this._color.toHsv();
			this._color = tinycolor({ a: hsva.a, h, s, v });
			return this;
		},

		alpha: (a: number): Color => {
			const rgba = this._color.toRgb();
			this._color = tinycolor({ ...rgba, a });
			return this;
		},
		red: (r: number): Color => {
			const rgba = this._color.toRgb();
			this._color = tinycolor({ ...rgba, r });
			return this;
		},
		green: (g: number): Color => {
			const rgba = this._color.toRgb();
			this._color = tinycolor({ ...rgba, g });
			return this;
		},
		blue: (b: number): Color => {
			const rgba = this._color.toRgb();
			this._color = tinycolor({ ...rgba, b });
			return this;
		},
		hue: (h: number): Color => {
			const hsva = this._color.toHsv();
			this._color = tinycolor({ ...hsva, h });
			return this;
		},
		saturation: (s: number): Color => {
			const hsva = this._color.toHsv();
			this._color = tinycolor({ ...hsva, s });
			return this;
		},
		value: (v: number): Color => {
			const hsva = this._color.toHsv();
			this._color = tinycolor({ ...hsva, v });
			return this;
		},
	};

	color() {
		return tinycolor(this._color.toRgb());
	}

	/**
	 * Return a color that mixes the two provided colors.
	 * The ratio provided indicates the proportion of the first color,
	 * with the remainder taken from the second color.
	 * @param c1 {Color}
	 * @param c2 {Color}
	 * @param ratio {number} value between 0 and 1. Default = 0.5 (equal mix)
	 * @returns {Color}
	 */
	static mix(c1: Color, c2: Color, ratio: number = 0.5): Color {
		const clampedRatio = clamp(ratio);

		const rgba1 = c1.get.rgb();
		const rgb2 = c2.get.rgb();

		const r = rgba1.r * clampedRatio + rgb2.r * (1 - clampedRatio);
		const g = rgba1.g * clampedRatio + rgb2.g * (1 - clampedRatio);
		const b = rgba1.b * clampedRatio + rgb2.b * (1 - clampedRatio);
		const a = rgba1.a * clampedRatio + rgb2.a * (1 - clampedRatio);

		const color = tinycolor({ r, g, b, a });
		const { h, s, v } = color.toHsv();
		return new Color({ h, s: s * 100, v: v * 100, a }); // saturation and value are in the 1-100 range on color input, but are returned as 0 to 1 by tinycolor.hsv()
	}

	/**
	 * Same as mix() but averages values along the HSV axis.
	 * Return a color that mixes the two provided colors.
	 * The ratio provided indicates the proportion of the first color,
	 * with the remainder taken from the second color.
	 * @param c1 {Color}
	 * @param c2 {Color}
	 * @param ratio {number} value between 0 and 1. Default = 0.5 (equal mix)
	 * @param options.hueMixingMode {HueMixingMode} direction hue travels around the hue circle between the two colors.
	 * Default = `SHORT`, the shorter way around.
	 * @returns {Color}
	 */
	static mixHsv(c1: Color, c2: Color, ratio: number = 0.5, options: { hueMixingMode?: HueMixingMode } = {}): Color {
		const clampedRatio = clamp(ratio);
		const { hueMixingMode = HueMixingModes.Short } = options;

		const hsva1 = c1.get.hsv();
		const hsva2 = c2.get.hsv();

		const h = (((hsva1.h + hueTravel(hsva1.h, hsva2.h, hueMixingMode) * (1 - clampedRatio)) % 360) + 360) % 360;
		const s = (hsva1.s * clampedRatio + hsva2.s * (1 - clampedRatio)) * 100; // saturation and value are in the 1-100 range on color input, but are returned as 0 to 1 by tinycolor.hsv()
		const v = (hsva1.v * clampedRatio + hsva2.v * (1 - clampedRatio)) * 100;
		const a = hsva1.a * clampedRatio + hsva2.a * (1 - clampedRatio);

		return new Color({ h, s, v, a });
	}
}

export default Color;
