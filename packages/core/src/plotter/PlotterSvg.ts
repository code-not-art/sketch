import Vec2 from '../math/Vec2.js';
import { Circle, Path, Rectangle } from '../structures/index.js';
import { serializeSvg } from '../svg/serializeSvg.js';
import { createSvgCircle, createSvgPath, createSvgRectangle, SvgGroup, SvgNode } from '../svg/SvgNode.js';
import { Values } from '../types/common.js';
import { Pen } from './pens.js';

export class PlotterSvg {
	private size: Vec2;

	/**
	 * Keys for each layer are the pen name. Ensure your pens have unique names!
	 */
	private layers: Record<string, { node: SvgGroup; pen: Pen }> = {};

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

		const layer: SvgGroup | undefined = this.layers[pen.name]?.node;

		if (layer) {
			layer.children.push(...nodes);
			return layer;
		}

		const newLayerNode: SvgGroup = {
			type: 'group',
			children: [...nodes],
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

	serialize(): string {
		const layerNodes = Object.values(this.layers).map((layer) => layer.node);
		return serializeSvg(layerNodes, { width: this.size.x, height: this.size.y, inkscapeLayers: true });
	}
}
