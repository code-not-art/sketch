# Make Code Not Art

TypeScript libraries for creating procedural art in the browser.

## Monorepo Structure

The repository is a monorepo containing reusable packages and standalone applications that rely on them. The monorepo is configured using [`pnpm`](https://pnpm.io/) and is managed using [`nx`](https://nx.dev/).

This monorepo is organized with the following directory structure:

```
.
├── apps/
│   └── demos
└── packages/
    ├── core
    └── sketch
```

| Component                                         | Path            | Published Location                                                                                                                                                                                  | Description                                                                            |
| ------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [Demos](apps/demos/README.md)                     | apps/demos/     | Not Published                                                                                                                                                                                       | Runnable app using [Sketch](./packages/sketch/) components - useful for dev testing.   |
| [@code-not-art/core](packages/core/README.md)     | packages/core   | [![@code-not-art/core NPM Package](https://img.shields.io/npm/v/@code-not-art/core?color=%23cb3837&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@overture-stack/lectern-client)     | Collection of tools to simplify pseudo-random generation and HTML canvas manipulation. |
| [@code-not-art/sketch](packages/sketch/README.md) | packages/sketch | [![@code-not-art/sketch Package](https://img.shields.io/npm/v/@code-not-art/sketch?color=%23cb3837&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@overture-stack/lectern-dictionary) | ReactJS component library to apply procedural art algorithms to HTML canvas.           |

## Quick Start

To get the demo application running on your local machine, after checking out this repository, execute the following steps:

1. Install dependencies

   This repository is managed by `pnpm` and the code will run in Node. You will need to install both.

   - `Node` - [Install Instruction](https://nodejs.org/en/download) - use latest stable version. Note: The Node website provides instructions for using `pnpm` as part of their install instructions if you choose to. If so, you can skip the separate `pnpm` instructions.
   - `pnpm` - [Install Instructions](https://pnpm.io/installation)

1. Install code dependencies

   ```shell
   pnpm install
   ```

1. Build all packages

   ```shell
   pnpm build:all
   ```

1. Run Demos App

   ```shell
   pnpm demo
   ```

   The application will start, hosting a website at `http://localhost:5173`. If the default port is in use, the console will print the actual running location of the app.

   Refer to the Demos Readme for instructions on using and modifying the demo applcation.
