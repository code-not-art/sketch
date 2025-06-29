import { Distribution } from '../Distribution.js';

/**
 * Centered distribution keeps the generated value close to the specified center value. The lower the spread,
 * the closer the output will be to the center value.
 * @param center The center value that all points will be moved towards. This should typically be a value from 0-1.
 * @param spread The amount of spread away from the center value. At 0, all values will map to the center exactly.
 * At [0-1], the output will be moved towards the center. Value of 1 will result in no change from the uniform distribution.
 * Any spread value greater than 1 will have the opposite effect, moving the output value away from center value.
 */
const Center =
	(center: number, spread: number): Distribution =>
	(x: number) => {
		if (x < center) {
			const max = center;
			const ratio = x / center;
			return Math.pow(ratio, spread) * center;
		} else {
			const range = 1 - center;
			const ratio = 1 - (x - center) / range;
			return 1 - Math.pow(ratio, spread) * range;
		}
	};

export default Center;
