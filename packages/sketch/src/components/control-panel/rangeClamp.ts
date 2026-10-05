import type { ControlPanelParameterRange, Range } from '../../control-panel/types/parameters.js';

/**
 * Applies the constraints of a range parameter to a proposed range value.
 *
 * The start and end are swapped if reversed, limited by `startMax` and `endMin`, and the distance between them is
 * kept between `diffMin` and `diffMax`. When the distance has to be corrected, the handle that did not move is held
 * in place, as determined by comparing the proposed start to the previous start.
 *
 * @param proposed The range requested by the user.
 * @param previous The range value before the user changed it.
 * @param parameter The range parameter definition providing the constraints.
 * @returns A new range that satisfies the parameter constraints.
 */
export const clampRange = (proposed: Range, previous: Range, parameter: ControlPanelParameterRange): Range => {
	let [start, end] = proposed;
	if (start > end) {
		const swap = start;
		start = end;
		end = swap;
	}
	start = Math.min(start, parameter.startMax);
	end = Math.max(end, parameter.endMin);

	const changingStart = start !== previous[0];

	const diff = end - start;
	if (diff < parameter.diffMin) {
		if (changingStart) {
			if (start + parameter.diffMin > parameter.max) {
				start = parameter.max - parameter.diffMin;
				end = parameter.max;
			} else {
				end = start + parameter.diffMin;
			}
		} else if (end - parameter.diffMin < parameter.min) {
			end = parameter.min + parameter.diffMin;
			start = parameter.min;
		} else {
			start = end - parameter.diffMin;
		}
	}
	if (diff > parameter.diffMax) {
		if (changingStart) {
			end = start + parameter.diffMax;
		} else {
			start = end - parameter.diffMax;
		}
	}
	return [start, end];
};
