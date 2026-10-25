/**
 * Restricts a value to within a defined range (default is 0 to 1).
 * If the input number is outside this range, then the min or max value of that
 * range wil be returned in its place. If the input number is within the range,
 * the original value will be returned.
 * @param value {number}
 * @param options {Object}
 * @returns {number}
 */
export function clamp(value: number, options: { min: number; max: number } = { min: 0, max: 1 }): number {
	return Math.max(options.min, Math.min(options.max, value));
}

/**
 * Wraps a value around into a range, like a modulo that works with any lower bound and with negative values.
 * The range includes `min` and excludes `max`, so a value equal to `max` wraps to `min`.
 * Values already within the range are returned unchanged. The range starts at 0 when `min` is omitted.
 * @throws {RangeError} if `max` is not greater than `min`
 */
export function wrap(value: number, options: { min?: number; max: number }): number {
	const { min = 0, max } = options;
	if (max <= min) {
		throw new RangeError(`wrap requires max to be greater than min, received min: ${min}, max: ${max}`);
	}
	const size = max - min;
	return min + ((((value - min) % size) + size) % size);
}
