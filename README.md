# @peterek/vite-plugin-font
Vite plugin for simple use of custom fonts

## Use in [Vite config](https://vitejs.dev/config/) file

### Minimal configuration

```js
import { join } from 'node:path'

import { font } from '@peterek/vite-plugin-font'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    font({
      font: {
        name: 'Pacifico',
        src: join(__dirname, 'assets/Pacifico/*.ttf'),
      },
    })
  ]
})
```

### Full configuration

```js
import { join } from 'node:path'

import { font } from '@peterek/vite-plugin-font'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    font({
      // Base directory for the font files to be accessed from (optional).
      // Default: `UserConfig['base'] + 'fonts'`
      base: '/',

      // Font definitons. It can be defined as single object or as list of configurations
      font: [
        {
          // Font name to be referenced by css rule e.g.: `font-family: Pacifico;`
          name: 'Pacifico',
          // Absolute path to the font sources using glob pattern
          src: join(__dirname, 'assets/Pacifico/*.ttf'),
          // The `font-display` descriptor used for each font-face (optional). Default: 'auto'
          display: 'auto',
        },
      ],

      // Location where inject link tags to (optional). Default: 'head-prepend'
      injectLinkTo: 'head-prepend',

      // Location where inject link tags to (optional). Default: 'head'
      injectStyleTo: 'head',

      // Prefetch fonts. If true, takes precedence over preload option (optional). Default: `false`
      prefetch: false,

      // Preload fonts (optional). Default: `false`
      preload: true,
    })
  ]
})
```
