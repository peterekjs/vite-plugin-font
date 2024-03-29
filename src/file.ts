import { dirname, join, relative } from 'node:path'
import { copyFile, mkdir } from 'node:fs/promises'

import type { ResolvedConfig } from 'vite'

import { DEFAULT_BASE } from './defaults'
import type { ResolvedFontPluginOptions } from './options'
import { toForwardSlash } from './tools'
import type { FontData, MappedFontPaths } from './types'

export async function copyAll(
  fileMap: MappedFontPaths,
  dest: string,
  base = '/'
) {
  await Promise.all(
    [...fileMap.fromFS.entries()].map(async ([from, to]) => {
      const target = join(dest, relative(base, to))
      await mkdir(dirname(target), { recursive: true })
      await copyFile(from, target)
    })
  )
}

export function getBase(
  config: Pick<ResolvedConfig, 'base'>,
  options: ResolvedFontPluginOptions
) {
  return options.base
    ? join(config.base, options.base)
    : join(config.base, DEFAULT_BASE)
}

export function createFontPathMap(
  data: FontData,
  base: string
): MappedFontPaths {
  const fromServer = new Map<string, string>()
  const fromFS = new Map<string, string>()

  data.forEach(({ faces }) => {
    faces.forEach(({ files }) => {
      files.forEach((file) => {
        const onServer = toForwardSlash(join(base, file.path.base))
        const onFS = file.src

        fromServer.set(onServer, onFS)
        fromFS.set(onFS, onServer)
      })
    })
  })

  return {
    fromServer,
    fromFS
  }
}
