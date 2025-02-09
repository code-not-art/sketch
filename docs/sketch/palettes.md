# Palette

> The `Palette` type is defined in the file [`src/sketch/Palette/index.ts`](../src/sketch/Palette/index.ts).

Palettes are a collection of colors intended to be used in combination. In a generative artwork, by selecting colors from a palette we can separate the pseudo-random generation of a palette from the colors applied to the canvas.()

For this library, each palette is defined as a tuple of 5 colors, and a pseudorandom number generator. The RNG provided can be used to generate additional colors beyond the initial 5 provided.

## Palette Types

- Curated = from the nice-color-palettes 1000 top palettes list, colourlovers.org
- Random = five randomly generated colors

## Usage
