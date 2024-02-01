import { type Plugin, type ResolvedConfig } from 'vite'

import { createFontLinkTags, createFontStyleTags } from './font'
import { createFontPathMap, getBase } from './file'
import type { ResolvedFontPluginOptions } from './options'
import { serveFontMiddleware } from './middleware'
import { prependMiddleware } from './tools'
import type { FontData, MappedFontPaths } from './types'

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
      fileMap = createFontPathMap(data, getBase(config, options))
    },
    configureServer({ middlewares }) {
      return () => {
        middlewares.use(serveFontMiddleware(fileMap.fromServer, config.base))
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
