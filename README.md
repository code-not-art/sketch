# Sketch Framework

Framework used to create a hot reloading canvas for art development using the [@code-not-art/core](https://github.com/code-not-art/core) canvas drawing library.

While this runs as a standalone dev environment, it is used as the foundation for [@code-not-art/template](https://github.com/code-not-art/template) which provides a blank canvas to easily make your own generative works. If you are looking to write some code that makes some art, start there instead.

## Quick Start

1. **Clone** to your computer - [How To](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

1. Install dependencies with npm:

   ```
   npm ci
   ```

   > **NOTE**: This is untested with `yarn` but almost certainly works. If you find issues please [raise an issue](https://github.com/code-not-art/sketch/issues).

1. Start development server:

   ```
   npm run dev
   ```

   The server will run on `localhost:1234`.

1. The page will render the sketch defined in `src/demos/sketch.ts`. Open this file your editor of choice and write your sketch there. The server will watch for changes to the file, drawing to the canvas on the browser whenever you save your work.

   Other demo sketches to play with are in that demos folder, but need to be imported into `src/demo.tsx` and added as a prop into the `App` element.

## Sketch Interface and Controls

| **Key** |                                        **Action**                                         |
| :-----: | :---------------------------------------------------------------------------------------: |
|   `s`   |                                  Save the current image                                   |
|   `m`   |                                 Show/Hide Parameter Menu                                  |
|         |                                                                                           |
| `space` |              Generate new **image** and **color** seeds. **Draw new image**.              |
|   `↑`   | Move to next **color** seed, or generate a new one if at end of list. **Draw new image**. |
|   `↓`   |                   Move to previous **color** seed. **Draw new image**.                    |
|   `→`   | Move to next **image** seed, or generate a new one if at end of list. **Draw new image**. |
|   `←`   |                   Move to previous **image** seed. **Draw new image**.                    |
|   `c`   |                     Generate new **color** seed. **Draw new image**.                      |
|   `i`   |                     Generate new **image** seed. **Draw new image**.                      |

## The Sketch Interface (AKA. writing your sketch)

<!-- interface Sketch {
  reset: (props: SketchProps) => void;
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, time: number) => void;
  params: Params;
  config: Config;
} -->

The canvas expects a prop of the [`Sketch`](src/sketch/Sketch.tsx) type. This interface allows you to provide configuration details for your sketch (`config`), and interactable parameters that you can update in browser (`params`). There are several methods for available for you to implement that will interact with the canvas and the seeded random generators provided by the framework. The only one of these that are absolutely required to provide is the `draw(props)` method, all others have sensible (mostly empty) defaults. To summarize the contents of Sketch:

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

| **Property** |                                             **Type**                                              |                                                                                                                   **Description**                                                                                                                   |
| :----------: | :-----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    canvas    | [`@code-not-art/core.Canvas`](https://github.com/code-not-art/core/blob/main/src/canvas/index.ts) |                                       Provides access to the canvas and 2D context directly, plus all the drawing tools provided by the [`code-not-art core library`](https://github.com/code-not-art/core).                                        |
|     rng      | [`@code-not-art/core.Random`](https://github.com/code-not-art/core/blob/main/src/random/index.ts) |                                                                                                 Random number generator provided the **image** seed                                                                                                 |
|   palette    |                             [`Palette`](src/sketch/Palette/index.ts)                              |                 Random Color Palette with 5 randomly selected colors. Changing the color seed will update the colors in the palette without affecting the random seed of the `rng` `Random` generator provided in the `SketchProps`                 |
|    params    |                                        `StringMap<any>`                                         |                                                The values for the parameters provided in the sketch definition. If these are updated in the UI then this params object will have the updated values.                                                |
|     data     |                                        `StringMap<any>`                                         | An object with no defined shape that can be used to store data that will not be reset between draw/loop calls and will persist across hot-reloads. This is particularly useful when writing loops to store state that persists from frame to frame. |
