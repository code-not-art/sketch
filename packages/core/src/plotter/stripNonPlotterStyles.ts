import type { SvgPlotterStyles, SvgStyles } from '../svg/styles.js';
import type { SvgNode } from '../svg/SvgNode.js';

// Declared as a record so that TypeScript reports an error if a key is added to or removed from `SvgPlotterStyles`
// without this list being updated.
const plotterStyleKeys: Record<keyof SvgPlotterStyles, true> = {
	stroke: true,
	strokeWidth: true,
	strokeLinecap: true,
	strokeLinejoin: true,
	strokeDasharray: true,
	strokeDashoffset: true,
	strokeOpacity: true,
	fill: true,
	fillOpacity: true,
	opacity: true,
	vectorEffect: true,
};

function isPlotterStyleKey(key: string): key is keyof SvgPlotterStyles {
	return key in plotterStyleKeys;
}

function stripStyles(styles: SvgStyles): SvgPlotterStyles {
	return Object.fromEntries(Object.entries(styles).filter(([key]) => isPlotterStyleKey(key)));
}

/**
 * Removes every style that a pen plotter cannot use from an SVG node and all of its descendants. Only the styles
 * listed in `SvgPlotterStyles` (stroke, fill and opacity properties) are kept.
 *
 * The input node is not modified. A new node is returned, and only the `styles` of the node and of any group
 * children are rewritten. All other properties, including `id`, `label`, `class`, `transform` and geometry, are
 * carried over unchanged. If a node has no plotter styles left, its `styles` property is omitted from the result.
 *
 * @param node The node to clean. A group is processed recursively through its children.
 * @returns A copy of the node containing only plotter styles.
 */
export function stripNonPlotterStyles(node: SvgNode): SvgNode {
	const { styles, ...rest } = node;
	const plotterStyles = styles === undefined ? {} : stripStyles(styles);
	const strippedStyles = Object.keys(plotterStyles).length > 0 ? { styles: plotterStyles } : {};

	if (rest.type === 'group') {
		return { ...rest, ...strippedStyles, children: rest.children.map(stripNonPlotterStyles) };
	}
	return { ...rest, ...strippedStyles };
}
