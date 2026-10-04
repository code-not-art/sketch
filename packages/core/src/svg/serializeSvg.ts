import type { ArcSegment } from '../structures/path/ArcSegment.js';
import type { Path } from '../structures/path/Path.js';
import { SegmentTypes } from '../structures/path/PathSegment.js';
import type { SvgNode } from './SvgNode.js';
import type { SvgStyles } from './styles.js';
import { serializeSvgTransforms } from './transform.js';

/**
 * Options for {@link serializeSvg}.
 */
export type SvgSerializeOptions = {
	/**
	 * Width of the `<svg>` element in user units. The `width` attribute is omitted when undefined.
	 */
	width?: number;
	/**
	 * Height of the `<svg>` element in user units. The `height` attribute is omitted when undefined.
	 */
	height?: number;
	/**
	 * When true, every group that is a direct child of the `<svg>` element is marked as an Inkscape layer
	 * (`inkscape:groupmode="layer"`), named by the group's `label`, or its `id` when it has no label.
	 * The Inkscape namespace is declared on the `<svg>` element. Nested groups are never layers.
	 * Default `false`.
	 */
	inkscapeLayers?: boolean;
};

type SvgAttribute = [name: string, value: string | number | undefined];

const escapeAttribute = (value: string): string =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Attributes with an undefined value are omitted.
 */
const serializeAttributes = (attributes: SvgAttribute[]): string =>
	attributes
		.flatMap(([name, value]) => (value === undefined ? [] : [` ${name}="${escapeAttribute(String(value))}"`]))
		.join('');

const element = (tag: string, attributes: SvgAttribute[], content?: string): string =>
	content === undefined
		? `<${tag}${serializeAttributes(attributes)}/>`
		: `<${tag}${serializeAttributes(attributes)}>${content}</${tag}>`;

/**
 * Style properties are written as presentation attributes (`strokeWidth` becomes `stroke-width="…"`),
 * which are understood by more tools than the `style` attribute.
 */
const styleAttributes = (styles: SvgStyles = {}): SvgAttribute[] =>
	Object.entries(styles).map(([property, value]): [string, string | number | undefined] => [
		property.replace(/[A-Z]/g, (uppercaseLetter) => `-${uppercaseLetter.toLowerCase()}`),
		value,
	]);

const arcPathData = (segment: ArcSegment): string => {
	// An SVG arc command cannot describe a full circle (start and end are the same point), or an arc past one
	// turn. Splitting into pieces of at most half a turn avoids both cases and means the large-arc flag is always 0.
	const pieceCount = Math.max(1, Math.ceil(Math.abs(segment.angle) / Math.PI));
	// Positive angles sweep clockwise on screen, which is sweep-flag 1.
	const sweepFlag = segment.angle > 0 ? 1 : 0;
	const commands: string[] = [];
	for (let pieceIndex = 1; pieceIndex <= pieceCount; pieceIndex++) {
		const end = pieceIndex === pieceCount ? segment.end : segment.get.point(pieceIndex / pieceCount);
		commands.push(`A ${segment.radius} ${segment.radius} 0 0 ${sweepFlag} ${end.x} ${end.y}`);
	}
	return commands.join(' ');
};

const pathData = (path: Path): string => {
	const start = path.get.start();
	const commands = path.get.segments().map((segment): string => {
		switch (segment.type) {
			case SegmentTypes.Move: {
				return `M ${segment.end.x} ${segment.end.y}`;
			}
			case SegmentTypes.Line: {
				return `L ${segment.end.x} ${segment.end.y}`;
			}
			case SegmentTypes.Arc: {
				return arcPathData(segment);
			}
			case SegmentTypes.Bezier2: {
				return `Q ${segment.control.x} ${segment.control.y} ${segment.end.x} ${segment.end.y}`;
			}
			case SegmentTypes.Bezier3: {
				const { control1, control2, end } = segment;
				return `C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`;
			}
		}
	});
	return [`M ${start.x} ${start.y}`, ...commands].join(' ');
};

const serializeNode = (node: SvgNode, isLayer: boolean = false): string => {
	const baseAttributes: SvgAttribute[] = [
		['id', node.id],
		['class', node.class?.length ? node.class.join(' ') : undefined],
		['transform', node.transform?.length ? serializeSvgTransforms(node.transform) : undefined],
		...styleAttributes(node.styles),
	];

	switch (node.type) {
		case 'group': {
			const layerAttributes: SvgAttribute[] = isLayer
				? [
						['inkscape:groupmode', 'layer'],
						['inkscape:label', node.label ?? node.id],
					]
				: [];
			const children = node.children.map((child) => serializeNode(child, false)).join('');
			return element('g', [...baseAttributes, ...layerAttributes], children);
		}
		case 'path': {
			return element('path', [['d', pathData(node.path)], ...baseAttributes]);
		}
		case 'circle': {
			const { center, radius } = node.circle;
			return element('circle', [['cx', center.x], ['cy', center.y], ['r', radius], ...baseAttributes]);
		}
		case 'rectangle': {
			const { min, max } = node.rectangle;
			const cornerX = typeof node.roundedCorners === 'number' ? node.roundedCorners : node.roundedCorners?.x;
			const cornerY = typeof node.roundedCorners === 'number' ? node.roundedCorners : node.roundedCorners?.y;
			return element('rect', [
				['x', min.x],
				['y', min.y],
				['width', max.x - min.x],
				['height', max.y - min.y],
				['rx', cornerX !== undefined && cornerX > 0 ? cornerX : undefined],
				['ry', cornerY !== undefined && cornerY > 0 ? cornerY : undefined],
				...baseAttributes,
			]);
		}
	}
};

/**
 * Create a string with for an svg based on the svg node data provided.
 *
 * The output will wrap an <svg> tag around the svg node content provided.
 *
 * Each node is written with its `id`, `class`, `transform` and style properties as attributes. Style
 * properties become presentation attributes in hyphenated form, e.g. `strokeWidth` is written as
 * `stroke-width`. Attribute values are escaped. Properties that are undefined are omitted.
 *
 * Paths are written as a single `d` attribute. Arcs are converted to SVG arc commands.
 *
 * @param nodes - Content of the svg, written in the order given (later nodes draw over earlier nodes).
 * @param options - Size of the svg element and Inkscape layer output. See {@link SvgSerializeOptions}.
 * @returns The svg markup as a string, suitable for writing to a file or setting as element content.
 */
export function serializeSvg(nodes: SvgNode[], options: SvgSerializeOptions = {}): string {
	const { width, height, inkscapeLayers = false } = options;
	const rootAttributes: SvgAttribute[] = [
		['version', '1.1'],
		['xmlns', 'http://www.w3.org/2000/svg'],
		['xmlns:inkscape', inkscapeLayers ? 'http://www.inkscape.org/namespaces/inkscape' : undefined],
		['width', width],
		['height', height],
	];
	const content = nodes.map((node) => serializeNode(node, inkscapeLayers && node.type === 'group')).join('');
	return element('svg', rootAttributes, content);
}
