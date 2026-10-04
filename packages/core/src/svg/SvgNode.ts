import Vec2 from '../math/Vec2.js';
import { Circle, Path, Rectangle } from '../structures/index.js';
import { SvgStyles } from './styles.js';
import { SvgTransform } from './transform.js';

export type SvgNodeBase = {
	id?: string; // should be unique per element in an svg
	label?: string; // Display label, optional and any value

	class?: string[];
	styles?: SvgStyles;
	transform?: SvgTransform[];
};

// ===== Container Elements ===== //
export type SvgGroup = SvgNodeBase & {
	type: 'group';
	children: SvgNode[];
};

// ===== Graphical Elements ===== //

export type SvgPath = SvgNodeBase & {
	type: 'path';
	path: Path;
};

export type SvgCircle = SvgNodeBase & {
	type: 'circle';
	circle: Circle;
};

export type SvgRectangle = SvgNodeBase & {
	type: 'rectangle';
	rectangle: Rectangle;
	roundedCorners?: Vec2 | number;
};

export type SvgNode = SvgGroup | SvgCircle | SvgRectangle | SvgPath;

export type CreateSvgNodeOptions = Partial<SvgNodeBase>;

export function createSvgPath(path: Path, options?: CreateSvgNodeOptions): SvgPath {
	return {
		type: 'path',
		path,
		...options,
	};
}

export function createSvgCircle(circle: Circle, options?: CreateSvgNodeOptions): SvgCircle {
	return {
		type: 'circle',
		circle,
		...options,
	};
}

export function createSvgRectangle(
	rectangle: Rectangle,
	options?: CreateSvgNodeOptions & Partial<Pick<SvgRectangle, 'roundedCorners'>>,
): SvgRectangle {
	return {
		type: 'rectangle',
		rectangle,
		...options,
	};
}
