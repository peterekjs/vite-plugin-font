import { createReadStream } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'

import type { Connect } from 'vite'

function return404(res: ServerResponse, next?: Connect.NextFunction) {
  if (next) {
    next()
    return
  }

  res.statusCode = 404
  res.end()
}

export function serveFontMiddleware(fileMap: Map<string, string>, base = '/') {
  return async function viteServeFontMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction
  ) {
    const { url } = req
    if (!url) {
      return return404(res, next)
    }

    const searchUrl = join(base, url)

    if (!fileMap.has(searchUrl)) {
      return return404(res, next)
    }

    const filePath = fileMap.get(searchUrl)
    if (!filePath) {
      return return404(res, next)
    }

    createReadStream(filePath).pipe(res)
  }
}
