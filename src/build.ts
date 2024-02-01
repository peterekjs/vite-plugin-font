import { resolve } from 'node:path'

import type { Plugin, ResolvedConfig } from 'vite'

import { copyAll, createFontPathMap, getBase } from './file'
import { createFontLinkTags, createFontStyleTags } from './font'
import type { ResolvedFontPluginOptions } from './options'
import type { FontData, MappedFontPaths } from './types'

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
      fileMap = createFontPathMap(data, getBase(config, options))
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
