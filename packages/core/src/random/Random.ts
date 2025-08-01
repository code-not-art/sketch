import srng from 'seed-random';

import { TAU } from '../constants.js';
import { Color, Vec2, type Rectangle } from '../index.js';
import { array, repeat } from '../utils/index.js';
import { Distribution } from './Distribution.js';
import { RandomContext } from './RandomContext.js';
import { Uniform } from './distributions/index.js';
import { words } from './words/index.js';

export class Random {
	_contexts: RandomContext[] = [];
	constructor(context: string, seed?: string | number) {
		const _seed = `${seed ? seed : Math.random()}`;
		this._contexts.push(this.createContext(context, _seed, Uniform));
	}

	createContext(context: string, seed: string, distribution: Distribution) {
		return {
			context,
			count: 0,
			distribution,
			seed,
			rng: srng(seed),
		};
	}

	/* ***
	 * Context Management
	 *** */

	// Get Data about current active context
	getContext(): RandomContext {
		return this._contexts[this._contexts.length - 1];
	}
	getCount(): number {
		return this.getContext().count;
	}
	getSeed(): string {
		return this.getContext().seed;
	}

	getContextByLabel(context: string): RandomContext | undefined {
		return this._contexts.find((i) => i.context === context);
	}
	getCountByLabel(context: string) {
		return this.getContextByLabel(context)?.count;
	}
	getSeedByLabel(context: string) {
		return this.getContextByLabel(context)?.seed;
	}
	getContexts() {
		return this._contexts;
	}

	/**
	 * Create a new random context. Contexts provide a new seeded RNG,
	 * calls to the RNG in one context will not affect the sequence of numbers in another context.
	 * When done using this context, call `.pop()` and the previous context will resume.
	 * @param context
	 * @param options {Object} `seed`: seed value for the new context, will be randomly generated by the current context if not provided. `distribution` the default numerical distribution function that will be applied within this context.
	 */
	push(context: string, options: { seed?: string; distribution?: Distribution } = {}) {
		const _seed = options.seed === undefined ? this.next().toString() : options.seed;
		const _distribution = options.distribution === undefined ? Uniform : options.distribution;
		this._contexts.push(this.createContext(context, _seed, _distribution));
	}

	pop() {
		this._contexts.pop();
	}

	reset() {
		const context = this.getContext();
		context.rng = srng(context.seed);
	}

	/* ***
	 * Make Random Stuff
	 *** */

	/**
	 * Get the next random value available. This will return a numerical value between 0 and 1.
	 * @param distribution {Distribution} modify
	 * @returns
	 */
	next(distribution?: Distribution): number {
		const _distribution = distribution ? distribution : this.getContext().distribution;
		const _context = this.getContext();
		_context.count++;
		const x = _context.rng();
		return _distribution(x);
	}

	bool(chance: number = 0.5, distribution?: Distribution): boolean {
		return this.next(distribution) <= chance;
	}

	int(min: number, max: number, distribution?: Distribution): number {
		return Math.floor(this.next(distribution) * (max - min + 1) + min);
	}

	float(min: number, max: number, distribution?: Distribution): number {
		return this.next(distribution) * (max - min) + min;
	}

	angle(distribution?: Distribution): number {
		return this.next(distribution) * TAU;
	}

	/**
	 * Randomize a color. Options allow control over the range of output values.
	 * @param options {Object} Provide a value for any of hue, saturation and value - or provide an object with min or max values to specify the range these values should be generated within. When choosing the range, you can specify a maximum above the range of the value (h: 360, s: 100, v: 100) to allow having a range that spans the hue around the extremes. For example `{h:{min:320, max: 400}}`. The generator will wrap the values above the maximum back within the expected range.
	 * @returns {Color}
	 */
	color(
		options: {
			h?: { min?: number; max?: number } | number;
			s?: { min?: number; max?: number } | number;
			v?: { min?: number; max?: number } | number;
		} = {},
	): Color {
		let h;
		let s;
		let v;

		// Choice of options will change the number of random calls, so execute this within a new random context
		this.push('random color');

		if (options.h) {
			if (options.h instanceof Object) {
				const min = options.h.min === undefined ? 0 : Math.max(0, options.h.min);
				const max = options.h.max === undefined ? 360 : options.h.max;
				h = this.float(min, max) % 360;
			} else {
				h = options.h;
			}
		}
		if (options.s) {
			if (options.s instanceof Object) {
				const min = options.s.min === undefined ? 0 : Math.max(0, options.s.min);
				const max = options.s.max === undefined ? 100 : options.s.max;
				s = this.float(min, max) % 100;
			} else {
				s = options.s;
			}
		}
		if (options.v) {
			if (options.v instanceof Object) {
				const min = options.v.min === undefined ? 0 : Math.max(0, options.v.min);
				const max = options.v.max === undefined ? 0 : options.v.max;
				v = this.float(min, max) % 100;
			} else {
				v = options.v;
			}
		}
		const seed = this.next().toString();
		const output = new Color({ seed, h, s, v });

		// Return to original random context
		this.pop();
		return output;
	}

	/**
	 * Random Vector. Default will produce a random unit vector (lenght 1, random direction).
	 * If bounds are provided, a random point that fits that rectangle will be returned.
	 * @param
	 * @param distribution {Distribution} is applied to the random angle applied to the unit vector
	 * @returns {Vec2}
	 */
	vec2(bounds?: Rectangle, distribution?: Distribution): Vec2 {
		this.push('vec2 generation');
		if (bounds) {
			return new Vec2(
				this.float(bounds.min.x, bounds.max.x, distribution),
				this.float(bounds.min.y, bounds.max.y, distribution),
			);
		}
		return Vec2.unit().rotate(this.angle(distribution));
		this.pop();
	}

	word() {
		return this.chooseOne(words);
	}

	fuzzy(base: number, distribution?: Distribution) {
		return {
			// The checks for range === 0  are done to ensure that the same number of calls to the rng are occurring, even if the fuzzy range is 0
			int: (range: number): number =>
				range === 0 ? this.next(distribution) * 0 + base : Math.round(this.int(-range, range, distribution) + base),
			float: (range: number): number =>
				range === 0
					? this.next(distribution) * 0 + base
					: this.float(-range * 100, range * 100, distribution) / 100 + base, // awkward 100 stuff because if range is small (like 0.1 or less) then the near zero values deal with float rounding issues.
		};
	}

	chooseOne<T>(items: Array<T> | ReadonlyArray<T>): T {
		return items[this.int(0, items.length - 1)];
	}

	choose<T>(items: T[], count: number, allowDuplicates: boolean = true): T[] {
		const output: T[] = [];
		if (allowDuplicates) {
			repeat(count, () => {
				output.push(this.chooseOne(items));
			});
		} else {
			// No Duplicates version
			const _count = count > items.length ? items.length : count;
			let options = array(_count);
			repeat(_count, () => {
				const selection = this.int(0, options.length);
				output.push(items[selection]);
				// Remove selection from options list
				options = options.slice(0, selection).concat(options.splice(selection + 1));
			});
		}
		return output;
	}

	shuffle<T>(items: T[]): T[] {
		const output = [...items];
		repeat(output.length, (i) => {
			const swap = this.int(i, output.length - 1);
			const temp = output[i];
			output[i] = output[swap];
			output[swap] = temp;
		});
		return output;
	}
}
