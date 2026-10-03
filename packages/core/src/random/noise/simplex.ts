import * as openSimplex from 'open-simplex-noise';
import { Noise2D, Noise3D, Noise4D, NoiseOptions } from './noise.js';

const defaultOptions = {
	amplitude: 1,
	frequency: 1,
	octaves: [0],
	wrap: {},
};

/**
 * Build a seeded 2D simplex noise function.
 *
 * @param seed - Any number is accepted; fractional seeds in [0, 1) are scaled up to an integer internally.
 * @param options.amplitude - Scales the output. Result magnitude is roughly within `[-amplitude, amplitude]`. Default `1`.
 * @param options.frequency - Base multiplier applied to the input coordinates before sampling; higher values produce noise that varies faster over the same input range. Default `1`.
 * @param options.octaves - List of octave exponents to layer together (fractal/turbulence noise). Each octave samples at `frequency * 2^octave`, and the results are summed then divided by `octaves.length` so amplitude stays consistent regardless of how many octaves are combined. Use e.g. `[0, 1, 2]` to blend a base frequency with two higher-detail layers. Default `[0]` (a single layer at the base frequency).
 * @param options.wrap - Accepted on the options type for seamless axis wrapping, but not currently implemented by this function.
 * @returns A `Noise2D` function: call it with `(x, y)` coordinates to sample the noise field. Returns a value in the range `[-amplitude, amplitude]`.
 */
export const simplex2 = (seed: number, options: NoiseOptions = {}): Noise2D => {
	const { amplitude, frequency, octaves } = {
		...defaultOptions,
		...options,
	};

	const positiveSeed = Math.abs(seed);
	const integerSeed =
		positiveSeed < 1 && positiveSeed >= 0
			? Math.floor(positiveSeed * Number.MAX_SAFE_INTEGER)
			: Math.floor(positiveSeed);

	const noise = openSimplex.makeNoise2D(integerSeed);
	return (x: number, y: number): number => {
		const output =
			octaves
				.map((octave) => {
					const freq = frequency * Math.pow(2, octave);
					return noise(x * freq, y * freq);
				})
				.reduce((acc, value) => acc + value, 0) *
			(amplitude / octaves.length);
		return output;
	};
};
/**
 * Build a seeded 3D simplex noise function.
 *
 * @param seed - Any number is accepted; fractional seeds in [0, 1) are scaled up to an integer internally.
 * @param options.amplitude - Scales the output. Result magnitude is roughly within `[-amplitude, amplitude]`. Default `1`.
 * @param options.frequency - Base multiplier applied to the input coordinates before sampling; higher values produce noise that varies faster over the same input range. Default `1`.
 * @param options.octaves - List of octave exponents to layer together (fractal/turbulence noise). Each octave samples at `frequency * 2^octave`, and the results are summed then divided by `octaves.length` so amplitude stays consistent regardless of how many octaves are combined. Use e.g. `[0, 1, 2]` to blend a base frequency with two higher-detail layers. Default `[0]` (a single layer at the base frequency).
 * @param options.wrap - Accepted on the options type for seamless axis wrapping, but not currently implemented by this function.
 * @returns A `Noise3D` function: call it with `(x, y, z)` coordinates to sample the noise field. Returns a value in the range `[-amplitude, amplitude]`.
 */
export const simplex3 = (seed: number, options: NoiseOptions = {}): Noise3D => {
	const { amplitude, frequency, octaves } = {
		...defaultOptions,
		...options,
	};

	const positiveSeed = Math.abs(seed);
	const integerSeed =
		positiveSeed < 1 && positiveSeed >= 0
			? Math.floor(positiveSeed * Number.MAX_SAFE_INTEGER)
			: Math.floor(positiveSeed);

	const noise = openSimplex.makeNoise3D(integerSeed);
	return (x: number, y: number, z: number): number => {
		const output =
			octaves
				.map((octave) => {
					const freq = frequency * Math.pow(2, octave);
					return noise(x * freq, y * freq, z * freq);
				})
				.reduce((acc, value) => acc + value, 0) *
			(amplitude / octaves.length);
		return output;
	};
};
/**
 * Build a seeded 4D simplex noise function.
 *
 * @param seed - Any number is accepted; fractional seeds in [0, 1) are scaled up to an integer internally.
 * @param options.amplitude - Scales the output. Result magnitude is roughly within `[-amplitude, amplitude]`. Default `1`.
 * @param options.frequency - Base multiplier applied to the input coordinates before sampling; higher values produce noise that varies faster over the same input range. Default `1`.
 * @param options.octaves - List of octave exponents to layer together (fractal/turbulence noise). Each octave samples at `frequency * 2^octave`, and the results are summed then divided by `octaves.length` so amplitude stays consistent regardless of how many octaves are combined. Use e.g. `[0, 1, 2]` to blend a base frequency with two higher-detail layers. Default `[0]` (a single layer at the base frequency).
 * @param options.wrap - Accepted on the options type for seamless axis wrapping, but not currently implemented by this function.
 * @returns A `Noise4D` function: call it with `(x, y, z, w)` coordinates to sample the noise field. Returns a value in the range `[-amplitude, amplitude]`.
 */
export const simplex4 = (seed: number, options: NoiseOptions = {}): Noise4D => {
	const { amplitude, frequency, octaves } = {
		...defaultOptions,
		...options,
	};

	const positiveSeed = Math.abs(seed);
	const integerSeed =
		positiveSeed < 1 && positiveSeed >= 0
			? Math.floor(positiveSeed * Number.MAX_SAFE_INTEGER)
			: Math.floor(positiveSeed);

	const noise = openSimplex.makeNoise4D(integerSeed);
	return (x: number, y: number, z: number, w: number): number => {
		const output =
			octaves
				.map((octave) => {
					const freq = frequency * Math.pow(2, octave);
					return noise(x * freq, y * freq, z * freq, w * freq);
				})
				.reduce((acc, value) => acc + value, 0) *
			(amplitude / octaves.length);
		return output;
	};
};
