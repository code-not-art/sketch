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
