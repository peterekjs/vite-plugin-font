import { join } from 'node:path'

import { Plugin, ResolvedConfig } from 'vite'

import { createFontLinkTags, createFontStyleTags } from './font'
import { createFontPathMap } from './file'
import type { ResolvedFontPluginOptions } from './options'
import { serveFontMiddleware } from './middleware'
import { prependMiddleware } from './tools'
import type { FontData, MappedFontPaths } from './types'

export const DEFAULT_BASE = './font'

export function servePlugin(
  options: ResolvedFontPluginOptions,
  data: FontData
): Plugin {
  let config: ResolvedConfig
  let fileMap: MappedFontPaths

  return {
    name: '@peterek/vite-plugin-font:serve',
    apply: 'serve',
    configResolved(_config) {
      config = _config
      fileMap = createFontPathMap(
        data,
        options.base ?? join(config.base, DEFAULT_BASE)
      )
    },
    configureServer({ middlewares }) {
      return () => {
        middlewares.use(serveFontMiddleware(fileMap.fromServer))
        prependMiddleware(
          middlewares.stack,
          'viteTransformMiddleware',
          'viteServeFontMiddleware'
        )
      }
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          ...createFontLinkTags(options, fileMap),
          ...createFontStyleTags(data, options, fileMap)
        ]
      }
    }
  }
}
