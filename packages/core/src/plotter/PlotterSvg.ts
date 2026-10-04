import Vec2 from '../math/Vec2.js';
import { Circle, Path, Rectangle } from '../structures/index.js';
import { serializeSvg } from '../svg/serializeSvg.js';
import { createSvgCircle, createSvgPath, createSvgRectangle, SvgGroup, SvgNode } from '../svg/SvgNode.js';
import { Pen } from './pens.js';
import { stripNonPlotterStyles } from './stripNonPlotterStyles.js';

/**
 * Builder to create an SVG for use with a pen plotter.
 * This has convenience functions that present limitted styling compared to an svg built for rendering on a screen.
 * Every graphical element added must be assigned a pen that will be used to plot it and will be assigned to a group
 * that provides consistent styling for that pen.
 *
 * When a node is added to the plotter svg, all styles that are not represented in a pen plotte will be stripped from
 * graphical elements other than the pen layer styles.
 */
export class PlotterSvg {
	/**
	 * Keys for each layer are the pen name. Ensure your pens have unique names!
	 */
	private layers: Record<string, { node: SvgGroup; pen: Pen }> = {};
	private size: Vec2;
	constructor(size: Vec2) {
		this.size = size;
	}

	/**
	 * Adds the node to the corresponding pen layer, or creates a new pen layer if this
	 * is the first time this pen is being used on this plot.
	 *
	 * Returns a reference to the layer for the pen.
	 *
	 * Note: Pens are identified by name. Make sure your pens all have unique names!
	 */
	add(pen: Pen, content: SvgNode | SvgNode[]): SvgGroup {
		const nodes = Array.isArray(content) ? content : [content];
		const strippedNodes = nodes.map((node) => stripNonPlotterStyles(node));

		const layer: SvgGroup | undefined = this.layers[pen.name]?.node;

		if (layer) {
			layer.children.push(...strippedNodes);
			return layer;
		}

		const newLayerNode: SvgGroup = {
			type: 'group',
			children: [...strippedNodes],
			id: pen.name,
			label: pen.name,
			styles: { stroke: pen.color, strokeWidth: pen.strokeWidth, fill: 'none' },
		};
		this.layers[pen.name] = { node: newLayerNode, pen };
		return newLayerNode;
	}

	addPath(pen: Pen, path: Path): SvgGroup {
		return this.add(pen, createSvgPath(path));
	}

	addCircle(pen: Pen, circle: Circle): SvgGroup {
		return this.add(pen, createSvgCircle(circle));
	}

	addRectange(pen: Pen, rectangle: Rectangle): SvgGroup {
		return this.add(pen, createSvgRectangle(rectangle));
	}

	serialize() {
		const layerNodes = Object.values(this.layers).map((layer) => {
			const group = layer.node;
			return group;
			// return { ...group, styles: { ...group.styles, strokeWidth: layer.pen.strokeWidth * pixelDensity } };
		});
		return serializeSvg(layerNodes, {
			width: this.size.x,
			height: this.size.y,
			inkscapeLayers: true,
		});
	}
}
