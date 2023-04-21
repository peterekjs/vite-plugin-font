import { extname, parse } from 'node:path'

import { globSync } from 'glob'
import type { HtmlTagDescriptor } from 'vite'

import type { ResolvedFontPluginOptions } from './options'
import {
  FontData,
  FontFace,
  FontDefinition,
  MappedFontPaths,
  ParsedFontDefinition
} from './types'

// #region Extractors
function extractFormat(filename: string) {
  const ext = extname(filename)

  if (ext === '.woff') return 'woff'
  if (ext === '.woff2') return 'woff2'
  if (ext === '.ttf') return 'truetype'
  if (ext === '.otf') return 'opentype'
  if (ext === '.svg') return 'svg'
  return ext.replace('.', '')
}

function extractWeight(filename?: string) {
  if (!filename) return 400
  filename = filename.toLowerCase()

  if (filename.includes('thin')) return 100
  if (filename.includes('extralight')) return 200
  if (filename.includes('ultralight')) return 200
  if (filename.includes('light')) return 300
  if (filename.includes('normal')) return 400
  if (filename.includes('medium')) return 500
  if (filename.includes('semibold')) return 600
  if (filename.includes('demibold')) return 600
  if (filename.includes('extrabold')) return 800
  if (filename.includes('ultrabold')) return 800
  if (filename.includes('bold')) return 700
  if (filename.includes('black')) return 900
  if (filename.includes('heavy')) return 900
  return 400
}

function extractStyle(filename?: string) {
  if (!filename) return 'normal'
  filename = filename.toLowerCase()

  if (filename.includes('normal')) return 'normal'
  if (filename.includes('italic')) return 'italic'
  if (filename.includes('oblique')) return 'oblique'
  return 'normal'
}
// #endregion

function resolveFontFaces(
  name: string,
  files: string[],
  display: FontDisplay = 'auto'
) {
  const fontFaces = new Map<string, FontFace>()

  files.forEach((src) => {
    const path = parse(src)
    if (!fontFaces.has(path.name)) {
      const fontFace: FontFace = {
        name,
        display,
        files: new Set(),
        style: extractStyle(path.base),
        weight: extractWeight(path.base)
      }
      fontFaces.set(path.name, fontFace)
    }

    fontFaces.get(path.name)?.files.add({
      format: extractFormat(path.base),
      path,
      src
    })
  })

  return [...fontFaces.values()]
}

export function parseFontDefinitions(
  fontDefinitions: FontDefinition[]
): FontData {
  return new Map(
    fontDefinitions.map(({ name, src, display }) => {
      const files = globSync(src)
      return [
        name,
        {
          name,
          src,
          files,
          faces: resolveFontFaces(name, files, display)
        }
      ]
    })
  )
}

export function createFontLinkTag(
  href: string,
  options: ResolvedFontPluginOptions
): HtmlTagDescriptor {
  return {
    tag: 'link',
    injectTo: options.injectLinkTo,
    attrs: {
      rel: options.prefetch ? 'prefetch' : 'preload',
      as: 'font',
      type: `font/${extname(href).replace('.', '')}`,
      href,
      crossorigin: true
    }
  }
}

export function createFontLinkTags(
  options: ResolvedFontPluginOptions,
  { fromServer }: MappedFontPaths
) {
  return options.prefetch || options.preload
    ? [...fromServer.keys()].map((href) => createFontLinkTag(href, options))
    : []
}

export function createFontFaceRule(
  face: FontFace,
  { fromFS }: MappedFontPaths
) {
  const sources = [...face.files]
    .filter((f) => fromFS.has(f.src))
    .map((f) => `url('${fromFS.get(f.src)}') format('${f.format}')`)
    .join(',\n\t\t')

  return [
    '@font-face {',
    `  font-family: '${face.name}';`,
    `  src: ${[sources].filter(Boolean).join(',')};`,
    `  font-weight: ${face.weight};`,
    `  font-style: ${face.style};`,
    `  font-display: ${face.display};`,
    '}'
  ].join('\n')
}

export function createFontStyleTag(
  { faces, name }: ParsedFontDefinition,
  options: ResolvedFontPluginOptions,
  fileMap: MappedFontPaths
): HtmlTagDescriptor {
  return {
    tag: 'style',
    injectTo: options.injectStyleTo,
    attrs: {
      type: 'text/css',
      'data-font': name
    },
    children: faces.map((face) => createFontFaceRule(face, fileMap)).join('\n')
  }
}

export function createFontStyleTags(
  data: FontData,
  options: ResolvedFontPluginOptions,
  fileMap: MappedFontPaths
): HtmlTagDescriptor[] {
  return [...data.values()].map((f) => createFontStyleTag(f, options, fileMap))
}
