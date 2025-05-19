import { Utils, Vec2 } from '@code-not-art/core';
import {
	ControlPanel,
	type ControlPanelElements,
	createSketch,
	createSketchConfig,
	PaletteType,
	Parameters,
	type SketchDraw,
	type SketchInit,
} from '@code-not-art/sketch';

const { repeat } = Utils;

const config = createSketchConfig({
	menuDelay: 0,
	paletteType: PaletteType.Random,
});

const controls = {
	sizes: ControlPanel('Size and Scale', {
		canvasFill: Parameters.number({
			label: 'Image Fill',
			initialValue: 0.76,
			min: 0.5,
			max: 1.1,
		}),
		gridWidth: Parameters.number({
			label: 'Grid Size',
			initialValue: 10,
			min: 1,
			max: 55,
			step: 1,
		}),
		circleFill: Parameters.number({
			label: 'Circle Fill',
			initialValue: 0.72,
			min: 0.1,
			max: 2,
			step: 0.001,
		}),
	}),

	background: Parameters.select<'Black' | 'White' | 'Palette' | 'None'>({
		label: 'Background Style',
		options: ['Black', 'White', 'Palette', 'None'] as const,
		initialValue: 'Black',
	}),

	masks: ControlPanel('Mask Layer', {
		chanceHidden: Parameters.number({
			label: 'Chance Hidden',
			initialValue: 0.72,
		}),
		chanceNoMask: Parameters.number({
			label: 'Chance No Mask',
			initialValue: 0.15,
		}),
		darkenRange: Parameters.number({
			label: 'Darken Masks',
			initialValue: 5,
			max: 20,
		}),
		lightenRange: Parameters.number({ label: 'Lighten Masks', max: 20 }),
		positionExponent: Parameters.number({
			label: 'Circle Position Spread',
			initialValue: 1,
			min: 0.01,
			max: 2,
			step: 0.01,
		}),
	}),
} satisfies ControlPanelElements;

type CustomControls = typeof controls;
type SketchData = {};

const draw: SketchDraw<CustomControls, SketchData> = ({ canvas, rng, palette, params }, _data) => {
	const {
		sizes: { canvasFill, circleFill, gridWidth },
		background,
		masks: { chanceHidden, chanceNoMask, darkenRange, lightenRange, positionExponent },
	} = params;

	// Background
	switch (background) {
		case 'Black': {
			canvas.fill('black');
			break;
		}
		case 'White': {
			canvas.fill('white');
			break;
		}
		case 'Palette': {
			canvas.fill(palette.colors[0]);
			break;
		}
		case 'None': {
			break;
		}
	}

	// Put origin at center of canvas:
	canvas.transform.translate(new Vec2(canvas.get.width() / 2, canvas.get.height() / 2));

	const circleRadius = (canvas.get.minDim() * canvasFill) / gridWidth / 2;

	// Base layer dots
	repeat(gridWidth, (x) => {
		repeat(gridWidth, (y) => {
			const center = new Vec2(x, y).add(0.5 - gridWidth / 2).scale(circleRadius * 2);
			canvas.draw.circle(
				{
					center,
					radius: circleRadius * circleFill,
				},
				{
					fill: palette.colors[1],
				},
			);
		});
	});

	// Overlaps
	repeat(gridWidth, (x) => {
		repeat(gridWidth, (y) => {
			// diagonal scheme
			const offsetPostitionScale = Math.pow(Math.abs(x - y) / gridWidth, positionExponent);

			const offset = Vec2.unit()
				.rotate(rng.angle())
				.scale(rng.int(0, circleRadius * circleFill))
				.scale(offsetPostitionScale);

			const center = new Vec2(x, y)
				.add(0.5 - gridWidth / 2)
				.scale(circleRadius * 2)
				.add(rng.bool(chanceHidden) ? 0 : offset);

			rng.push('draw masks');
			const hideMask = !rng.bool(chanceNoMask);
			hideMask &&
				canvas.draw.circle(
					{
						center,
						radius: circleRadius * circleFill + 1,
					},
					{
						fill: palette.colors[0]
							.color()
							.darken(rng.fuzzy(darkenRange).float(darkenRange))
							.lighten(rng.fuzzy(lightenRange).float(lightenRange)),
					},
				);
			rng.pop();
		});
	});
};

const init: SketchInit<CustomControls, SketchData> = () => {
	return {};
};

// const loop: SketchLoop<typeof parameters, SketchData> = ({}: Props, data: SketchData, {}: FrameData): boolean => {};

// const reset: SketchReset<typeof parameters, SketchData> = ({}: Props) => {};

const Art = createSketch<CustomControls, SketchData>({
	config,
	controls,
	init,
	draw,
	// loop,
	// reset,
});

export default Art;
