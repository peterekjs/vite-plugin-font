import type { ParsedPath } from 'node:path'

export type Require<T> = T & T extends undefined
  ? never
  : T extends null
  ? never
  : T

export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional'

export type FontDefinition = {
  name: string
  src: string
  display?: FontDisplay
}

export type FontFile = {
  format: string
  path: ParsedPath
  src: string
}

export type FontFace = {
  name: string
  display: FontDisplay
  files: Set<FontFile>
  style: string
  weight: number
}

export type MappedFontPaths = {
  fromServer: Map<string, string>
  fromFS: Map<string, string>
}

export type ParsedFontDefinition = FontDefinition & {
  faces: FontFace[]
  files: string[]
}

export type FontData = Map<string, ParsedFontDefinition>
