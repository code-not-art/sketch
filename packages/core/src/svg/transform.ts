import Vec2 from '../math/Vec2.js';

// Note: Intentionally postponing adding a transform matrix interface
//       since it is not how I will mostly want to interact with svg transforms
export type SvgTransformScale = { type: 'scale'; x: number; y?: number };
export type SvgTransformRotate = { type: 'rotate'; degrees: number; center?: Vec2 };
export type SvgTransformSkewX = { type: 'skewX'; degrees: number };
export type SvgTransformSkewY = { type: 'skewY'; degrees: number };
export type SvgTransformTranslate = { type: 'translate'; x: number; y?: number };

/**
 * All available SVG Transforms as typed data.
 *
 * Discriminated union on `.type`
 */
export type SvgTransform =
	| SvgTransformRotate
	| SvgTransformScale
	| SvgTransformSkewX
	| SvgTransformSkewY
	| SvgTransformTranslate;

const serializeSvgTransform = (transform: SvgTransform): string => {
	switch (transform.type) {
		case 'rotate': {
			const { degrees, center } = transform;
			return center ? `rotate(${degrees} ${center.x} ${center.y})` : `rotate(${degrees})`;
		}
		case 'scale': {
			const { x, y } = transform;
			return y === undefined ? `scale(${x})` : `scale(${x} ${y})`;
		}
		case 'skewX': {
			return `skewX(${transform.degrees})`;
		}
		case 'skewY': {
			return `skewY(${transform.degrees})`;
		}
		case 'translate': {
			const { x, y } = transform;
			return y === undefined ? `translate(${x})` : `translate(${x} ${y})`;
		}
	}
};

/**
 * Convert a list of transforms into the value for an SVG element's `transform` attribute.
 *
 * Order of application: the transforms are written in the order given, and the browser applies
 * them to the element starting from the **last** item and working back to the **first**. The last
 * transform in the array acts on the element's own coordinates first, and the first transform in
 * the array is applied last, so it acts in the outermost coordinate space.
 *
 * Example: `[{ type: 'translate', x: 100 }, { type: 'scale', x: 2 }]` produces
 * `translate(100) scale(2)`. The element is scaled by 2 around the origin, then moved 100 units
 * right. Reversing the array moves the element 100 units first and then scales, which moves it
 * to 200.
 */
export const serializeSvgTransforms = (transforms: SvgTransform[]): string =>
	transforms.map(serializeSvgTransform).join(' ');
