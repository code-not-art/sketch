import { Constants, Gradient, Utils, Vec2 } from '@code-not-art/core';
import {
	type ControlPanelElements,
	createSketch,
	createSketchConfig,
	Palette,
	Parameters,
	type SketchDraw,
	type SketchInit,
	SketchLoop,
	SketchReset,
} from '@code-not-art/sketch';
const { TAU } = Constants;
const { repeat } = Utils;

const controls = {
	speed: Parameters.number({ label: 'Speed', step: 0.001, max: 10 }),
	rotationSpeed: Parameters.number({
		label: 'Rotation Speed',
		step: 0.001,
		max: 10,
	}),
	dotSize: Parameters.number({
		label: 'Dot Size',
		initialValue: 0.04,
		min: 0.005,
		max: 0.2,
	}),
	dotCount: Parameters.number({
		label: 'Dot Count',
		initialValue: 24,
		min: 1,
		max: 89,
		step: 1,
	}),
	twists: Parameters.number({
		label: 'Twists',
		initialValue: 5,
		min: 1,
		max: 8,
		step: 1,
	}),
} satisfies ControlPanelElements;

type CustomControls = typeof controls;
type SketchData = {
	angle: number;
	absoluteAngle: number;
	gradient: Gradient;
};

const config = createSketchConfig({
	enableLoopControls: true,
	menuDelay: 20,
});

const createGradient = (palette: Palette) => new Gradient(palette.colors[1], palette.colors[2]).loop();

const init: SketchInit<CustomControls, SketchData> = ({ palette }) => {
	const data: SketchData = {
		angle: 0,
		absoluteAngle: 0,
		gradient: createGradient(palette),
	};
	return data;
};

const reset: SketchReset<CustomControls, SketchData> = ({ palette }, data) => {
	// Keep position of animation, only update color gradient (if changed)
	return { ...data, gradient: createGradient(palette) };

	// If there were any canvas cleanup after the draw we could run that here in reset().
	// If you want to preserve some data between runs, that can also be done here, though you would not have reproducible drawings then...
	// Finally, if init is doing some expensive calculations upfront that you don't want to repeat on each draw, you can reference those results here instead of re-computing them.
};

const draw: SketchDraw<CustomControls, SketchData> = ({ canvas }, _data) => {
	// One time setup instructions that we don't need to repeat every frame:
	canvas.transform.translate(canvas.get.size().scale(0.5));
};

const loop: SketchLoop<CustomControls, SketchData> = ({ canvas, palette, params }, data, { frameTime }) => {
	const { dotCount, dotSize, rotationSpeed, speed, twists } = params;

	const gradient = data.gradient;

	canvas.fill(palette.colors[0]);

	const nextAngle = data.angle + ((frameTime / 10000) * TAU * speed) / twists;
	data.angle = nextAngle % TAU;

	const nextAbsoluteAngle = data.absoluteAngle + (frameTime / 10000) * TAU * rotationSpeed;
	data.absoluteAngle = nextAbsoluteAngle % TAU;

	repeat(dotCount, (i) => {
		const repeatFraction = i / dotCount;
		const angle = data.angle + TAU * repeatFraction;
		const spinRadius = canvas.get.minDim() * 0.25;
		const spinOffset = Vec2.unit()
			.scale(canvas.get.minDim() * 0.15)
			.rotate(TAU * repeatFraction);

		const circleOrigin = Vec2.unit()
			.rotate(angle * twists)
			.scale(spinRadius)
			.add(spinOffset)
			.rotate(data.absoluteAngle);

		canvas.draw.circle(
			{
				center: circleOrigin,
				radius: canvas.get.minDim() * dotSize,
			},
			{
				fill: gradient.at(i / (dotCount > 1 ? dotCount - 1 : 1)),
			},
		);
	});
	return false;
};

const Art = createSketch<CustomControls, SketchData>({
	config,
	controls,
	draw,
	init,
	loop,
	reset,
});

export default Art;
