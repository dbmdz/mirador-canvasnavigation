# mirador-canvasnavigation

[![npm package][npm-badge]][npm]
[![required Mirador version][mirador-badge]][mirador]

A Mirador 3 plugin which replaces the builtin canvas navigation with an extended one containing the following functionalities:

- scroll to the first canvas
- scroll to the previous canvas
- scroll to a user-selected canvas
- scroll to the next canvas
- scroll to the last canvas
- display the current canvas index and label

![Screenshot][screenshot]

## Installation

Currently the plugin can only be used if you build your own Mirador JavaScript bundle.
To include the plugin in your Mirador installation, you need to install it
from npm with `npm install mirador-canvasnavigation`, import it into your project
and pass it to Mirador when you instantiate the viewer:

```javascript
import Mirador from 'mirador/dist/es/src/index';
import canvasNavigationPlugin from 'mirador-canvasnavigation/es';

const miradorConfig = {
  // Your Mirador configuration
}
Mirador.viewer(config, [...canvasNavigationPlugin]);
```

## Configuration

You can configure the plugin globally for all windows and/or individually for
every window.

For global configuration add the `canvasNavigation` entry to the top-level
`window` configuration (globally for all windows) or to the individual window
object:

```javascript
const miradorConfig = {
  window: {
    // ....
    canvasNavigation: {
      // Global config for all windows, see available settings below
    },
  },
  windows: [{
    // ....
    canvasNavigation: {
      // config for an individual window, see available settings below
    },
  }, // ...
}
```

You can view an example configuration in [demo/src/index.js][demo-cfg].

The available settings are:

- `handleCanvasLabel`: A function that modifies the canvas label if needed, the default implementation does not change anything.
  Receives this information about the current window:
  ```
  {
    canvasLabel: ...,
    currentCanvasIndex: ...,
    manifestId: ...,
  }
  ```
  Must return a string.

## Contributing

Found a bug? The plugin is not working with your manifest? Want a new
feature? Create an issue, or if you want to take a shot at fixing it
yourself, make a fork, create a pull request, we're always open to
contributions :-)

For larger changes/features, it's usually wise to open an issue before
starting the work, so we can discuss if it's a fit.

**Note**: The package requires Node.js `16` and npm in major version `8`.

[demo-cfg]: https://github.com/dbmdz/mirador-canvasnavigation/blob/main/demo/src/index.js#L5-L38
[mirador]: https://github.com/ProjectMirador/mirador/releases/tag/v3.3.0
[mirador-badge]: https://img.shields.io/badge/Mirador-%E2%89%A53.3.0-blueviolet
[npm]: https://www.npmjs.org/package/mirador-canvasnavigation
[npm-badge]: https://img.shields.io/npm/v/mirador-canvasnavigation.png?style=flat-square
[screenshot]: .docassets/screenshot.png
