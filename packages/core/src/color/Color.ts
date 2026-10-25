import { Colord, colord } from 'colord';

import { Random } from '../random/index.js';
import {
	type Hsva,
	type HueMixingMode,
	type Rgba,
	hsvaToRgba,
	mixHsva,
	mixRgba,
	normalizeHsva,
	rgbaToHsva,
} from './colorModels.js';

class Color {
	seed;
	// HSVA is stored directly, rather than a colord instance, because colord rounds the values returned by toHsv().
	// Reading them back after every change would quantize the color.
	private _hsva: Hsva;

	/**
	 * @param options
	 * h = hue, is 0 to 360, values outside this range wrap around the hue circle - default: random
	 *
	 * s = saturation, is 0 to 100 - default: random
	 *
	 * v = value, is 0 to 100 - default: random
	 *
	 * a = alpha, is 0 to 1 - default: 1
	 *
	 * seed = any string - default: random
	 *
	 * rng = existing Random generator - default: new Random generator based on the seed value
	 *
	 * A string can be given in place of the options object, in hex (`#ff0000`), rgb() or hsl() notation.
	 * @throws {Error} if a string is given that is not in one of those formats, including CSS color names
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
			this._hsva = normalizeHsva({ h: _rng.float(1, 360), s: _rng.float(0, 100), v: _rng.float(0, 100), a: 1 });
		} else if (typeof options === 'string') {
			this._hsva = Color.fromColord(Color.parseColorString(options));
		} else {
			this.seed = options.seed ?? new Random(`Random Color Seed`).next().toString();
			const _rng = options.rng ?? new Random(`Color ${this.seed}`, this.seed);

			this._hsva = normalizeHsva({
				h: options.h ?? _rng.float(0, 360),
				s: options.s ?? _rng.float(0, 100),
				v: options.v ?? _rng.float(0, 100),
				a: options.a ?? 1,
			});
		}
	}

	/**
	 * Parse a color string in hex (with or without a leading `#`), rgb() or hsl() notation.
	 * @throws {Error} if the string is not in one of those formats
	 */
	private static parseColorString(input: string): Colord {
		const trimmed = input.trim();
		const isBareHex = /^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed);
		const color = colord(isBareHex ? `#${trimmed}` : trimmed);
		if (!color.isValid()) {
			throw new Error(`Unable to parse color string "${input}", expected hex, rgb() or hsl() notation.`);
		}
		return color;
	}

	/**
	 * Convert using the unrounded RGBA values held by colord. Its toHsv() rounds to whole numbers, which shifts the color.
	 */
	private static fromColord(color: Colord): Hsva {
		return rgbaToHsva(color.rgba);
	}

	private toColord(): Colord {
		return colord(hsvaToRgba(this._hsva));
	}

	rgb(): string {
		return this.toColord().toRgbString();
	}

	get = {
		alpha: (): number => this._hsva.a,
		/** Channels are integers from 0 to 255, alpha is from 0 to 1. */
		rgb: (): Rgba => this.toColord().toRgb(),
		/** Hex string without a leading `#`. Alpha is not included. */
		hex: (): string =>
			colord({ ...hsvaToRgba(this._hsva), a: 1 })
				.toHex()
				.slice(1),
		/** Hue is 0 to 360, saturation and value are 0 to 100, alpha is 0 to 1. */
		hsv: (): Hsva => ({ ...this._hsva }),
	};

	set = {
		rgb: (r: number, g: number, b: number): Color => {
			this._hsva = Color.fromColord(colord({ r, g, b, a: this._hsva.a }));
			return this;
		},
		/**
		 * Set the color from a hex string, with or without a leading `#`.
		 * Alpha is set from the string if it includes alpha digits (4 or 8 digit hex), otherwise the current alpha is kept.
		 * @throws {Error} if the string cannot be parsed
		 */
		hex: (value: string): Color => {
			const parsed = Color.fromColord(Color.parseColorString(value));
			const hasAlpha = /^#?([0-9a-f]{4}|[0-9a-f]{8})$/i.test(value.trim());
			this._hsva = hasAlpha ? parsed : { ...parsed, a: this._hsva.a };
			return this;
		},
		hsv: (h: number, s: number, v: number): Color => {
			this._hsva = normalizeHsva({ h, s, v, a: this._hsva.a });
			return this;
		},

		alpha: (a: number): Color => {
			this._hsva = normalizeHsva({ ...this._hsva, a });
			return this;
		},
		red: (r: number): Color => {
			this._hsva = Color.fromColord(colord({ ...this.toColord().rgba, r }));
			return this;
		},
		green: (g: number): Color => {
			this._hsva = Color.fromColord(colord({ ...this.toColord().rgba, g }));
			return this;
		},
		blue: (b: number): Color => {
			this._hsva = Color.fromColord(colord({ ...this.toColord().rgba, b }));
			return this;
		},
		hue: (h: number): Color => {
			this._hsva = normalizeHsva({ ...this._hsva, h });
			return this;
		},
		saturation: (s: number): Color => {
			this._hsva = normalizeHsva({ ...this._hsva, s });
			return this;
		},
		value: (v: number): Color => {
			this._hsva = normalizeHsva({ ...this._hsva, v });
			return this;
		},
	};

	/**
	 * A colord instance of this color, for further manipulation (lighten, darken, rotate, etc.).
	 * Changes made through the returned instance do not affect this Color.
	 */
	color(): Colord {
		return this.toColord();
	}

	/**
	 * Returns a new color that mixes the two provided colors by averaging their RGB channels.
	 * @param ratio the proportion of the first color, from 0 to 1, with the remainder taken from the second color.
	 * Defaults to 0.5, an equal mix.
	 */
	static mix(c1: Color, c2: Color, ratio: number = 0.5): Color {
		const mixed = mixRgba(hsvaToRgba(c1._hsva), hsvaToRgba(c2._hsva), ratio);
		return new Color(rgbaToHsva(mixed));
	}

	/**
	 * Same as mix() but averages values along the HSV axis.
	 * Returns a new color that mixes the two provided colors.
	 * @param ratio the proportion of the first color, from 0 to 1, with the remainder taken from the second color.
	 * Defaults to 0.5, an equal mix.
	 * @param options.hueMixingMode the direction hue travels around the hue circle between the two colors.
	 * Defaults to `SHORT`, the shorter way around.
	 */
	static mixHsv(c1: Color, c2: Color, ratio: number = 0.5, options: { hueMixingMode?: HueMixingMode } = {}): Color {
		return new Color(mixHsva(c1._hsva, c2._hsva, ratio, options));
	}
}

export default Color;
