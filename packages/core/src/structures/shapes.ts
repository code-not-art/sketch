import Vec2 from '../math/Vec2.js';

export type Bezier2 = {
	start: Vec2;
	control: Vec2;
	end: Vec2;
};

export type Bezier3 = {
	start: Vec2;
	control1: Vec2;
	control2: Vec2;
	end: Vec2;
};

export type Circle = {
	center: Vec2;
	radius: number;
};

export type Ellipse = {
	center: Vec2;
	radiusX: number;
	radiusY: number;
	rotation?: number;
};

export type Line = {
	start: Vec2;
	end: Vec2;
};
