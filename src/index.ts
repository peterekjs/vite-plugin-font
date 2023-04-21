import type { Plugin } from 'vite'

import { parseFontDefinitions } from './font'
import { resolveOptions } from './options'
import type { FontPluginOptions } from './options'
import { servePlugin } from './serve'

export function font(options: FontPluginOptions = {}): Plugin[] {
  const resolvedOptions = resolveOptions(options)
  const data = parseFontDefinitions(resolvedOptions.font)

  return [servePlugin(resolvedOptions, data)]
}
