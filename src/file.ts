import { dirname, join } from 'node:path'
import { copyFile, mkdir } from 'node:fs/promises'

import { FontData, MappedFontPaths } from './types'

export async function copyAll(fileMap: MappedFontPaths, dest: string) {
  await Promise.all(
    [...fileMap.fromFS.entries()].map(async ([from, to]) => {
      const target = join(dest, to)
      await mkdir(dirname(target), { recursive: true })
      await copyFile(from, target)
    })
  )
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
        const onServer = join(base, file.path.base)
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
