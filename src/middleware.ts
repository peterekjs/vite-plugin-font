import { createReadStream } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'

import type { Connect } from 'vite'

function return404(res: ServerResponse, next?: Connect.NextFunction) {
  if (next) {
    next()
    return
  }

  res.statusCode = 404
  res.end()
}

export function serveFontMiddleware(fileMap: Map<string, string>) {
  return async function viteServeFontMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction
  ) {
    const { url } = req
    if (!url || !fileMap.has(url)) {
      return return404(res, next)
    }

    const filePath = fileMap.get(url)
    if (!filePath) {
      return return404(res, next)
    }

    console.log('accessing', filePath)

    createReadStream(filePath).pipe(res)
  }
}
