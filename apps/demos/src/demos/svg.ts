import { createSvgCircle, createSvgRectangle, Rectangle, Vec2, type SvgNode } from '@code-not-art/core';
import {
	createSketch,
	createSketchConfig,
	Parameters,
	type ControlPanelElements,
	type SketchDraw,
} from '@code-not-art/sketch';

const config = createSketchConfig({ menuDelay: 5 });

const controls = {
	count: Parameters.number({ label: 'Circles', initialValue: 60, min: 1, max: 300, step: 1 }),
} satisfies ControlPanelElements;

type CustomControls = typeof controls;
type CustomData = {};

/**
 * Draws random circles as an SVG. The SVG is rendered onto the canvas and can be exported
 * with the Export menu (SVG button) or Shift+S.
 */
const draw: SketchDraw<CustomControls, CustomData> = async ({ canvas, palette, params, rng }) => {
	canvas.fill('#111');

	const size = canvas.get.size();
	const nodes: SvgNode[] = [
		createSvgRectangle(Rectangle({ corner: Vec2.zero(), width: size.x, height: size.y }), {
			styles: { fill: 'none', stroke: palette.colors[0].rgb(), strokeWidth: 8 },
		}),
	];

	for (let count = 0; count < params.count; count++) {
		nodes.push(
			createSvgCircle(
				{ center: new Vec2(rng.float(0, size.x), rng.float(0, size.y)), radius: rng.float(10, size.x / 10) },
				{
					styles: {
						fill: 'none',
						stroke: palette.rng.chooseOne(palette.colors).rgb(),
						strokeWidth: 3,
					},
				},
			),
		);
	}

	await canvas.svg.draw(nodes);
};

export default createSketch<CustomControls, CustomData>({
	config,
	controls,
	init: () => ({}),
	draw,
});
