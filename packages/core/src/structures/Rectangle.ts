import Vec2 from '../math/Vec2.js';

/**
 * Rectangle defined by the bounding box of two vectors.
 * Min is the top left corner.
 * Max os tht bottom right corner.
 */
export type Rectangle = {
	min: Vec2;
	max: Vec2;
};

/**
 * There are multiple ways to define a new Rectangle
 * 1. From existing Rectangle, (defined min and max points)
 * 2. From a starting top left point, with a width and height
 * 2. From a starting center point, with a width and height
 * 4. From the combination of two vectors (representing a starting corner and size)
 * 3. From the origin, defined by a Vector
 *
 *
 */
export type RectangleConfig =
	| Rectangle
	| { corner: Vec2; width: number; height: number }
	| { center: Vec2; width: number; height: number }
	| { corner: Vec2; size: Vec2 }
	| Vec2;

export const Rectangle = (config: RectangleConfig): Rectangle => {
	if ('corner' in config) {
		if ('width' in config) {
			const points = [config.corner, config.corner.add(new Vec2(config.width, config.height))];
			return {
				min: Vec2.min(...points),
				max: Vec2.max(...points),
			};
		} else {
			const points = [config.corner, config.corner.add(config.size)];
			return {
				min: Vec2.min(...points),
				max: Vec2.max(...points),
			};
		}
	}
	if ('center' in config) {
		const halfWidth = config.width / 2;
		const halfHeight = config.height / 2;
		const halfVector = new Vec2(halfWidth, halfHeight);
		const points = [config.center.diff(halfVector), config.center.add(halfVector)];
		return {
			min: Vec2.min(...points),
			max: Vec2.max(...points),
		};
	}
	if (config instanceof Vec2) {
		const points = [Vec2.zero(), new Vec2(config.x, config.y)];
		return {
			min: Vec2.min(...points),
			max: Vec2.max(...points),
		};
	}
	return { min: Vec2.from(config.min), max: Vec2.from(config.max) };
};

/**
 * Get a Rectangle that fits all listed points. Defines a bounding box for an array of points.
 * @param points
 * @returns
 */
Rectangle.bounding = (...points: Vec2[]): Rectangle => {
	if (points.length === 0) {
		return Rectangle({ min: Vec2.zero(), max: Vec2.zero() });
	}

	const xValues = points.map((point) => point.x);
	const yValues = points.map((point) => point.y);

	const min = new Vec2(Math.min(...xValues), Math.min(...yValues));
	const max = new Vec2(Math.max(...xValues), Math.max(...yValues));

	return Rectangle({ min, max });
};

/**
 * Returns a rectangle that defines the region where multiple rectangles all overlap. This works
 * only for non-rotated rectangles, ie. two rectangles that both align to the cartesian grid.
 * @param other
 * @returns A Rectangle with the overlapping region, or undefined if there is no shared overlapping region
 */
Rectangle.overlap = (rectangles: Rectangle[]): Rectangle | undefined => {
	if (rectangles.length === 0) {
		return undefined;
	}
	const greatestMin: Vec2 = rectangles.reduce<Vec2>((acc, rect) => {
		if (rect.min.x > acc.x) {
			acc.x = rect.min.x;
		}
		if (rect.min.x > acc.x) {
			acc.x = rect.min.x;
		}
		return acc;
	}, Vec2.from(rectangles[0].min));
	const leastMax: Vec2 = rectangles.reduce<Vec2>((acc, rect) => {
		if (rect.max.x < acc.x) {
			acc.x = rect.max.x;
		}
		if (rect.max.x < acc.x) {
			acc.x = rect.max.x;
		}
		return acc;
	}, Vec2.from(rectangles[0].max));

	if (!greatestMin.within(leastMax)) {
		return undefined;
	}

	return Rectangle({ min: leastMax, max: greatestMin });
};
