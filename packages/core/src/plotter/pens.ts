export type Pen = {
	name: string;
	brand: string;
	colorDescription: string;

	color: string;
	strokeWidth: number;
};

export function createPen(props: { brand: string; colorDescription: string; color: string; strokeWidth: number }): Pen {
	const { brand, color, colorDescription, strokeWidth } = props;
	return {
		name: `${brand} - ${colorDescription}`,
		brand,
		color,
		colorDescription,
		strokeWidth,
	};
}
