import { Distribution } from '../Distribution.js';

/**
 * Max at the center, linearly drops off to zero as the value moves away from the center.
 *
 * This has no effect on a random number generation. Instead, this can be used in situations
 * where you want to apply a transformation more towards a central value than over the rest
 * of a range.
 * @param center
 * @returns
 */
const Peak =
	(center = 0.5): Distribution =>
	(x: number) => {
		if (x <= center) {
			if (center === 0) {
				return 1;
			}
			return x / center;
		}
		return (1 - x) / (1 - center);
	};

export default Peak;
