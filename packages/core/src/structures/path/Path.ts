import { TAU } from '../../constants.js';
import Vec2 from '../../math/Vec2.js';
import { ratioArray } from '../../utils/arrays.js';
import { clamp } from '../../utils/numeric.js';
import { Rectangle, type RectangleConfig } from '../Rectangle.js';
import { type Bezier2, type Bezier3, type Circle, type Line } from '../shapes.js';
import { ArcSegment } from './ArcSegment.js';
import { Bezier2Segment } from './Bezier2Segment.js';
import { Bezier3Segment } from './Bezier3Segment.js';
import { LineSegment } from './LineSegment.js';
import { MoveSegment } from './MoveSegment.js';
import { SegmentTypes, type PathSegment } from './PathSegment.js';

export class Path {
	private start: Vec2;
	private end: Vec2;
	private segments: PathSegment[];
	constructor(start: Vec2) {
		this.start = start;
		this.end = start;
		this.segments = [];
	}

	get = {
		bounds: (): { min: Vec2; max: Vec2 } => {
			let min = Vec2.from(this.start);
			let max = Vec2.from(this.start);
			this.segments.forEach((segment) => {
				const bounds = segment.get.bounds();

				min.x = Math.min(min.x, bounds.min.x);
				min.y = Math.min(min.y, bounds.min.y);

				max.x = Math.max(max.x, bounds.max.x);
				max.y = Math.max(max.y, bounds.max.y);
			});
			return Rectangle({ min, max });
		},
		size: (): Vec2 => {
			const bounds = this.get.bounds();
			return bounds.max.diff(bounds.min);
		},
		end: (): Vec2 => this.end,
		length: (): number =>
			this.segments.reduce((acc, segment) => {
				acc += segment.get.length();
				return acc;
			}, 0),
		normal: (position: number): Vec2 => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.segments[0]?.get.normal(0);
			}
			if (clampedPosition === 1) {
				return this.segments[this.segments.length - 1]?.get.normal(1);
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					const remainingRatio = clampedPosition - traveledRatio;
					const targetRatio = clamp(remainingRatio / segmentLengthRatio, {
						max: 1,
						min: 0,
					});
					return segment.get.normal(targetRatio);
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the path. Returning the end of the path!',
			);
			return this.segments[this.segments.length - 1]?.get.normal(1);
		},
		point: (position: number): Vec2 => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.start;
			}
			if (clampedPosition === 1) {
				return this.get.end();
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					const remainingRatio = clampedPosition - traveledRatio;
					const targetRatio = clamp(remainingRatio / segmentLengthRatio, {
						max: 1,
						min: 0,
					});
					return segment.get.point(targetRatio);
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the line. Returning the end of the line!',
			);
			return this.get.end();
		},
		segmentAt: (position: number): PathSegment => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.segments[0];
			}
			if (clampedPosition === 1) {
				return this.segments[this.segments.length - 1];
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					return segment;
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the path. Returning the end of the path!',
			);
			return this.segments[this.segments.length - 1];
		},
		segments: () => [...this.segments],
		/**
		 * Return a new path that traces this path between two points.
		 * @param props
		 * @returns
		 */
		slice: (props: { start: number; end: number; steps: number }): Path => {
			const pointRatios = ratioArray(props.steps).map((ratio) => ratio * (props.end - props.start) + props.start);
			const slicePoints = pointRatios.map((ratio) => this.get.point(ratio));
			return Path.fromPoints(slicePoints);
		},
		/**
		 * Return an array of Paths that include all segments from this path split on MoveSegments.
		 * If a path has n MoveSegments, the returned array will have n+1 Paths.
		 */
		splits: (): Path[] => {
			const output: Path[] = [];
			let activePath: Path | undefined;
			this.segments.forEach((segment) => {
				if (activePath === undefined) {
					activePath = new Path(segment.start);
				}
				if (segment.type === SegmentTypes.Move) {
					if (activePath.get.length() > 0) {
						output.push(activePath);
					}
					activePath = undefined;
				}
				activePath?.add(segment);
			});
			if (activePath && activePath.get.length() > 0) {
				output.push(activePath);
			}
			return output;
		},
		start: (): Vec2 => Vec2.from(this.start),
		tangent: (position: number): Vec2 => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.segments[0]?.get.tangent(0);
			}
			if (clampedPosition === 1) {
				return this.segments[this.segments.length - 1]?.get.tangent(1);
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					const remainingRatio = clampedPosition - traveledRatio;
					const targetRatio = clamp(remainingRatio / segmentLengthRatio, {
						max: 1,
						min: 0,
					});
					return segment.get.tangent(targetRatio);
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the path. Returning the end of the path!',
			);
			return this.segments[0]?.get.tangent(0);
		},
	};

	transform = {
		scale: (factor: number | Vec2, center = Vec2.zero()): Path => {
			const output = new Path(this.start.scale(factor, center));
			this.segments.forEach((segment) => output.add(segment.transform.scale(factor, center)));
			return output;
		},
		rotate: (angle: number, pivot = Vec2.zero()): Path => {
			const output = new Path(this.start.rotate(angle, pivot));
			this.segments.forEach((segment) => output.add(segment.transform.rotate(angle, pivot)));
			return output;
		},
		translate: (translation: Vec2): Path => {
			const output = new Path(this.start.add(translation));
			this.segments.forEach((segment) => output.add(segment.transform.translate(translation)));
			return output;
		},
		map: (divisions: number, transform: (point: Vec2, index: number, ratio: number, path: Path) => Vec2): Path => {
			const positions = ratioArray(divisions);
			const mappedPositions = positions.map((position, index) =>
				transform(this.get.point(position), index, position, this),
			);
			return Path.fromPoints(mappedPositions);
		},
		/**
		 * Transform path into many line segments. This will remove all arcs and bezier curves, but move gaps will be kept.
		 * @param divisions
		 */
		linearize: (divisions: number): Path => {
			const totalLength = this.get.length();
			const paths = this.get.splits();
			const output = new Path(this.start);
			paths.forEach((path) => {
				const pathLength = path.get.length();
				const pathDivisions = Math.floor((pathLength / totalLength) * divisions);
				const linearPath = path.transform.map(pathDivisions, (point) => point);
				output.join(linearPath);
			});
			return output;
		},
	};

	arc(angle: number, center: Vec2): this {
		const segment = ArcSegment({ start: this.get.end(), center, angle });

		return this.add(segment);
	}

	move(destination: Vec2): this {
		const segment = MoveSegment({ start: this.get.end(), end: destination });

		return this.add(segment);
	}

	line(destination: Vec2): this {
		const segment = LineSegment({ start: this.get.end(), end: destination });

		return this.add(segment);
	}

	bez2(end: Vec2, control: Vec2): this {
		const segment = Bezier2Segment({ start: this.get.end(), control, end });
		return this.add(segment);
	}

	bez3(end: Vec2, control1: Vec2, control2: Vec2): this {
		const segment = Bezier3Segment({
			start: this.get.end(),
			control1,
			control2,
			end,
		});
		return this.add(segment);
	}

	add(segment: PathSegment): this {
		this.segments.push(segment);
		this.end = segment.end;
		return this;
	}

	/**
	 * Combine another path with this one. This will move the path to the start of the other path and then add all
	 * segments from that path onto this path.
	 * @param path
	 * @returns
	 */
	join(path: Path, options?: { connect?: boolean }): this {
		if (!(path.start.x === this.start.x && path.start.y === this.start.y)) {
			if (options?.connect) {
				this.line(path.start);
			} else {
				this.move(path.start);
			}
		}
		if (path.segments) {
			path.segments.forEach((segment) => {
				this.add(segment);
			});
		}
		return this;
	}

	static fromCircle(circle: Circle): Path {
		const startPos = circle.center.add(Vec2.unit().scale(circle.radius));
		return new Path(startPos).arc(TAU, circle.center);
	}

	static fromLine(line: Line): Path {
		return new Path(line.start).line(line.end);
	}

	static fromRectangle(config: RectangleConfig): Path {
		const rectangle = Rectangle(config);
		const corners = [
			new Vec2(rectangle.max.x, rectangle.min.y),
			rectangle.max,
			new Vec2(rectangle.min.x, rectangle.max.y),
		];
		return new Path(rectangle.min).line(corners[0]).line(corners[1]).line(corners[2]).line(rectangle.min);
	}

	static fromBez2(bez2: Bezier2): Path {
		return new Path(bez2.start).bez2(bez2.end, bez2.control);
	}

	static fromBez3(bez3: Bezier3): Path {
		return new Path(bez3.start).bez3(bez3.end, bez3.control1, bez3.control2);
	}

	static fromPoints(points: Vec2[]): Path {
		const path = new Path(points[0]);
		for (let i = 1; i < points.length; i++) {
			path.line(points[i]);
		}
		return path;
	}

	static from(input: Path | PathSegment): Path {
		if (input instanceof Path) {
			const path = new Path(input.start);
			input.segments.forEach((segment) => path.add(segment));
			return path;
		}
		const path = new Path(input.start);
		path.add(input);
		return path;
	}
}
