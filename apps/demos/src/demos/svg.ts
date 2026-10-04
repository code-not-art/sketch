import { Constants, Utils, Vec2 } from '@code-not-art/core';
import { createPen, PAGE_SIZE, Pen, PlotterSvg } from '@code-not-art/core/plotter';
import {
	createSketch,
	createSketchConfig,
	Parameters,
	type ControlPanelElements,
	type SketchDraw,
} from '@code-not-art/sketch';

const { repeat } = Utils;
const { ISO_PAPER_ASPECT_RATIO } = Constants;

const config = createSketchConfig({ menuDelay: 5, width: 1000, height: 1000 * ISO_PAPER_ASPECT_RATIO });

const controls = {
	count: Parameters.number({ label: 'Circles', initialValue: 60, min: 1, max: 300, step: 1 }),
} satisfies ControlPanelElements;

type CustomControls = typeof controls;
type CustomData = {};

const pens: Record<string, Pen> = {
	black: createPen({ brand: 'NoName', color: '#000000', strokeWidth: 0.75, colorDescription: 'Black' }),
	red: createPen({ brand: 'NoName', color: '#FF0000', strokeWidth: 0.75, colorDescription: 'Red' }),
	green: createPen({ brand: 'NoName', color: '#00FF00', strokeWidth: 0.75, colorDescription: 'Green' }),
	blue: createPen({ brand: 'NoName', color: '#0000FF', strokeWidth: 0.75, colorDescription: 'Blue' }),
};
const penOptions = Object.values(pens);

/**
 * Draws random circles as an SVG. The SVG is rendered onto the canvas and can be exported
 * with the Export menu (SVG button) or Shift+S.
 */
const draw: SketchDraw<CustomControls, CustomData> = async ({ canvas, palette, params, rng }) => {
	// Able to interact with canvas before and after drawign an svg
	// drawing to canvas does not impact the svg created when it is exported.
	// An svg drawn to a canvas WILL be part of the png image created when the canvas image is exported.
	canvas.fill('#555');
	const randomPen = () => palette.rng.chooseOne(penOptions);

	const size = PAGE_SIZE.A4;
	const plot = new PlotterSvg(size);

	repeat(params.count, () => {
		plot.addCircle(randomPen(), {
			center: new Vec2(rng.float(0, size.x), rng.float(0, size.y)),
			radius: rng.float(10, size.x / 10),
		});
	});

	await canvas.svg.draw(plot.serialize());
};

export default createSketch<CustomControls, CustomData>({
	config,
	controls,
	init: () => ({}),
	draw,
});
