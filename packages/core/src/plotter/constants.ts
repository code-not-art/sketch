import Vec2 from '../math/Vec2.js';

export const INKSCAPE_DEFAULT_PIXEL_DENSITY = 377 / 100;

/**
 * Convert a desired real world mm distance into screen pixel size, based on the pixel density or conversion ration of
 * the print, plot, or display setup.
 *
 * Default density is the default inkscape svg scale desnity (37 pixels per milimeter);
 *
 * @returns pixel count that is equivalent to the real world distance provided in milimeters.
 */
export const mmToPixels = (mm: number, density = INKSCAPE_DEFAULT_PIXEL_DENSITY) => density * mm;

export const mmToPixelsVec2 = (mm: Vec2, density = INKSCAPE_DEFAULT_PIXEL_DENSITY) => mm.scale(density);

/**
 * Stores standard pageSizes in milimeters. You should convert this to svg screen size based on the target
 * output device pixel density, this can be done via mmToPixelsVec2(PAGE_SIZE.{selected page format}).
 *
 * Page sizes are stored in Portait orientation (taller than wide).
 */
export const PAGE_SIZE = {
	A1: new Vec2(549, 840),
	A2: new Vec2(420, 549),
	A3: new Vec2(297, 420),
	A4: new Vec2(210, 297),
	A5: new Vec2(248.5, 210),
	A6: new Vec2(105, 148.5),
	A7: new Vec2(74.25, 105),
} as const satisfies Record<string, Vec2>;
