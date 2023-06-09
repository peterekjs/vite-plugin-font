import { resolve } from 'node:path'

import type { Plugin, ResolvedConfig } from 'vite'

import { DEFAULT_BASE } from './defaults'
import { copyAll, createFontPathMap } from './file'
import { createFontLinkTags, createFontStyleTags } from './font'
import type { ResolvedFontPluginOptions } from './options'
import { FontData, MappedFontPaths } from './types'

export function buildPlugin(
  options: ResolvedFontPluginOptions,
  data: FontData
): Plugin {
  let config: ResolvedConfig
  let fileMap: MappedFontPaths

  return {
    name: '@peterek/vite-plugin-font:build',
    apply: 'build',
    configResolved(_config) {
      config = _config
      fileMap = createFontPathMap(
        data,
        options.base
          ? resolve(config.base, options.base)
          : resolve(config.base, DEFAULT_BASE)
      )
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          ...createFontLinkTags(options, fileMap),
          ...createFontStyleTags(data, options, fileMap)
        ]
      }
    },
    async writeBundle() {
      await copyAll(
        fileMap,
        resolve(config.envDir ?? process.cwd(), config.build.outDir),
        config.base
      )
    }
  }
}
