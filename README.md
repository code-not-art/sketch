# Code Not Art - Sketch!

Framework to create a hot reloading canvas for art development using the [@code-not-art/core](https://github.com/code-not-art/core) canvas drawing library.

This can be used as a template library, ready to be cloned and run, missing only your sketch. It will also be packaged for npm, providing components for this sketch layout.

## Quick Start

> **TEMP WARNING**: not documented in the steps, you need to locally link the [core library](https://github.com/code-not-art/core) or this won't run. Build that library then `npm link` in that library, then `npm link @code-not-art/core` in this repo. Should build fine after.

To use this library as a sketch template, here are steps you can follow to run this project on your own machine.

> **NOTE**: You likely want to [fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and clone that fork instead of working against this repo.

1. [Clone this repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository) to your local machine.

1. Install dependencies with npm:

   ```
   npm ci
   ```

   > **NOTE**: This is untested with `yarn` but almost certainly works. If you find issues please raise an issue.

1. Start development server:

   ```
   npm run dev
   ```

   The server will run on `localhost:1234`.

1. The page will render the sketch defined in `src/art.tsx`. Open this file your editor of choice and write your sketch there. The server will watch for changes to the file, drawing to the canvas on the browser on save.

## Sketch Interface and Controls

| **Key** |                                        **Action**                                         |
| :-----: | :---------------------------------------------------------------------------------------: |
|   `s`   |                                  Save the current image                                   |
| `space` |              Generate new **image** and **color** seeds. **Draw new image**.              |
|   `↑`   | Move to next **color** seed, or generate a new one if at end of list. **Draw new image**. |
|   `↓`   |                   Move to previous **color** seed. **Draw new image**.                    |
|   `→`   | Move to next **image** seed, or generate a new one if at end of list. **Draw new image**. |
|   `←`   |                   Move to previous **image** seed. **Draw new image**.                    |
|   `c`   |                     Generate new **color** seed. **Draw new image**.                      |
|   `i`   |                     Generate new **image** seed. **Draw new image**.                      |

## The Sketch Interface (AKA. writing your sketch)

> Note: For the moment this is prone to dramatic changes, we're in a bit of a trial and error stage with this. Use the file `art.tsx` as a template for a new sketch as it has all the relevant components and a simplistic but working example.

<!-- interface Sketch {
  reset: (props: SketchProps) => void;
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, time: number) => void;
  params: Params;
  config: Config;
} -->

The canvas expects a prop of the [`Sketch`](src/Sketch.tsx) type. This interface allows you to provide configuration details for your sketch (`config`), and interactable parameters that you can update in browser (`params`). There are several methods for available for you to implement that will interact with the canvas and the seeded random generators provided by the framework. The only one of these that are absolutely required to provide is the `draw(props)` method, all others have sensible (mostly empty) defaults. To summarize the contents of Sketch:

|       **Property**       |                                                 **Type**                                                  | **Required** |                                                                                                       **Description**                                                                                                       |                                 **Default**                                 |
| :----------------------: | :-------------------------------------------------------------------------------------------------------: | :----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
|         `config`         |                            JSON matching type [`Config`](src/sketch/Config.ts)                            |      No      |                                                                                 Configure image and project properties such as canvas size.                                                                                 | Image size: 1080x1080<br/>Random Seed (based on DateTime)<br/>FrameRate: 60 |
|         `params`         |                                       An array of `Param` objects.                                        |      No      |                                                                            Adds adjustable parameters for the sketch to the Menu in the browser.                                                                            |                          No interactive parameters                          |
|      `init(props)`       |                       Function providing [`SketchProps`](src/sketch/SketchProps.ts)                       |      No      | Runs when sketch is first passed to the [`Canvas`](https://github.com/code-not-art/core/blob/main/src/canvas/index.ts) allowing for expensive up front work to be done once and not repeated when new images are generated. |                          No operations performed.                           |
|      `reset(props)`      |                       Function providing [`SketchProps`](src/sketch/SketchProps.ts)                       |      No      |                                                            Runs when user requests a new image to be drawn. Use this to reset any data as needed between draws.                                                             |             Clears the canvas back to empty (all transparent).              |
|      `draw(props)`       |                       Function providing [`SketchProps`](src/sketch/SketchProps.ts)                       |   **Yes**    |                                    The main drawing actions of the sketch. This is run after `init`. When a user requests a new image to be generated this will run again after `reset`.                                    |                                      -                                      |
| `loop(props, frameData)` | Function providing [`SketchProps`](src/sketch/SketchProps.ts) and [`FrameData`](src/sketch/FrameData.ts). |      No      |                                        Will be called every frame of the animation loop controlled by the page. The framerate will attempt to match the value specified in `config`.                                        |                          No operations performed.                           |

### SketchProps

The [`SketchProps`](src/sketch/SketchProps.ts) are provided provided to every function in the Sketch definition. They provide access to the `Canvas`, and to the seeded `Random` generators. The full list of properties available and links to their code or documentation is:

| **Property** |                                             **Type**                                              |                                                                            **Description**                                                                             |
| :----------: | :-----------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    Canvas    | [`@code-not-art/core.Canvas`](https://github.com/code-not-art/core/blob/main/src/canvas/index.ts) | Provides access to the canvas and 2D context directly, plus all the drawing tools provided by the [`code-not-art core library`](https://github.com/code-not-art/core). |
|     rng      | [`@code-not-art/core.Random`](https://github.com/code-not-art/core/blob/main/src/random/index.ts) |                                                          Random number generator provided the **image** seed                                                           |
|     rng      | [`@code-not-art/core.Random`](https://github.com/code-not-art/core/blob/main/src/random/index.ts) |       Random number generator provided the **color** seed. <br/>_Note: this will hopefully be replaced soon with a **Palette** object to handle color selection_       |
