import { SvgProperties } from 'csstype';
export type SvgStyles = SvgProperties;

export type SvgPlotterStyles = Pick<
	SvgStyles,
	| 'stroke'
	| 'strokeWidth'
	| 'strokeLinecap'
	| 'strokeLinejoin'
	| 'strokeDasharray'
	| 'strokeDashoffset'
	| 'strokeOpacity'
	| 'fill'
	| 'fillOpacity'
	| 'opacity'
	| 'vectorEffect'
>;
