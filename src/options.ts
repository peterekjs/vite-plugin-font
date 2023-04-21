import type { HtmlTagDescriptor } from 'vite'

import type { FontDefinition, Require } from './types'
import { assertFontDefinition } from './assert'

export type FontPluginOptions = {
  /**
   * Base directory for the font files to be accessed from
   *
   * @defaultValue `undefined`
   */
  base?: string

  /**
   * List of font definitons
   *
   * @remarks
   * See {@link FontDefinition| the FontDefinition type} for more details.
   *
   * @defaultValue `FontDefinition[]`
   */
  font?: FontDefinition | FontDefinition[]

  /**
   * Location where inject link tags to
   *
   * @remarks
   * See the injectTo property of {@link HtmlTagDescriptor| HTMLTagDescriptor} for more details.
   *
   * @defaultValue `head-prepend`
   */
  injectLinkTo?: HtmlTagDescriptor['injectTo']

  /**
   * Location where inject style tags to
   *
   * @remarks
   * See the injectTo property of {@link HtmlTagDescriptor| HTMLTagDescriptor} for more details.
   *
   * @defaultValue `head-prepend`
   */
  injectStyleTo?: HtmlTagDescriptor['injectTo']

  /**
   * Prefetch fonts
   *
   * @defaultValue `false`
   */
  prefetch?: boolean

  /**
   * Preload fonts
   *
   * @defaultValue `false`
   */
  preload?: boolean
}

export type ResolvedFontPluginOptions = {
  base?: string
  font: FontDefinition[]
  injectLinkTo: Require<HtmlTagDescriptor['injectTo']>
  injectStyleTo: HtmlTagDescriptor['injectTo']
  prefetch: boolean
  preload: boolean
}

export function resolveOptions(
  options: FontPluginOptions
): ResolvedFontPluginOptions {
  const font = Array.isArray(options.font)
    ? options.font
    : options.font
    ? [options.font]
    : []

  font.forEach(assertFontDefinition)

  return {
    base: options.base,
    font,
    injectLinkTo: options.injectLinkTo ?? 'head-prepend',
    injectStyleTo: options.injectStyleTo ?? 'head',
    prefetch: options.prefetch ?? false,
    preload: options.preload ?? false
  }
}
