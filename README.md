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

## Sketch Components
