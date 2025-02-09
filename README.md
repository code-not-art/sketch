# Make Code Not Art

TypeScript libraries for creating procedural art images in the browser.

## Monorepo Structure

The repository is organized with the following directory structure:

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
