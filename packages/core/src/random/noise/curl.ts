import Vec2 from '../../math/Vec2.js';
import { Noise2D, Noise3D, Noise4D } from './index.js';

/**
 * 2d curl angle from noise
 */
export const curl = (
	position: Vec2,
	noise: Noise2D | Noise3D | Noise4D,
	config: {
		z?: number;
		w?: number;
		resolution?: number;
	},
) => {
	const delta = config.resolution || 0.01;
	const x0 = position.x;
	const x1 = position.x + delta;
	const y0 = position.y;
	const y1 = position.y + delta;
	const z = config.z === undefined ? 0 : config.z;
	const w = config.w === undefined ? 0 : config.w;

	const dx = (noise(x1, y0, z, w) - noise(x0, y0, z, w)) / delta;
	const dy = (noise(x0, y1, z, w) - noise(x0, y0, z, w)) / delta;
	return new Vec2(dy, dx).angle();
};
