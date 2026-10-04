# Canvas

> The `Canvas` class is defined in [`src/`]

A `Canvas` is a wrapper around an HTML canvas element, providing access to its 2d rendering context ([`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)) as well as some convenience methods to access canvas properties and perform simple canvas manipulations.

## Definition

## Usage

### Creating a Canvas Object

### Drawing to Canvas

#### API Draw Library

#### Context2D API

The context from the HTML canvas is readily available, found at `canvas.context`. This provides access to the native [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) API.

In the following example, we draw a square to the canvas directly:

```ts
const ctx = canvas.context;

// Set line width
ctx.lineWidth = 10;

// Draw rectangle at specific pixels
ctx.fillRect(130, 190, 40, 60);
```

> [!NOTE]
> Using the `canvas.draw` convenience library will overwrite the style properties. For example, the `lineWidth` set in the previous example will be overwritten by all draw calls since those will reset the `lineWidth` to a value appropriate to that draw. This applies to line and fill styles, not text styles.

#### Layers

#### SVG

An SVG can be rendered onto the canvas with `canvas.svg.draw`. It accepts either an array of `SvgNode`s, which are serialized at the canvas width and height, or a complete SVG string (which should declare its own `width` and `height`). Drawing is asynchronous, so the returned promise must be awaited.

```ts
await canvas.svg.draw([createSvgCircle({ center: canvas.get.center(), radius: 100 }, { styles: { stroke: 'white' } })]);
```

The most recent SVG is remembered and can be read with `canvas.svg.source()`. This returns `undefined` if no SVG has been drawn since the canvas was last cleared or resized. `SketchController` uses this to export the SVG from the UI. Drawing a second SVG replaces the remembered one; combine layers into a single SVG to export them together.

`canvas.draw.svg(svgString, { position, size, blendMode })` rasterizes an SVG string without remembering it.
