import { join } from 'node:path'
import { FontData, MappedFontPaths } from './types'

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
