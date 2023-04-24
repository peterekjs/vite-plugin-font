import { sep } from 'node:path'

import type { Connect } from 'vite'

export function toForwardSlash(pathString: string) {
  return pathString.split(sep).join('/')
}

export function findMiddlewareIndex(
  stack: Connect.ServerStackItem[],
  name: string
) {
  return stack.findIndex(
    (middleware) =>
      typeof middleware.handle === 'function' && middleware.handle.name === name
  )
}

export function prependMiddleware(
  stack: Connect.ServerStackItem[],
  targetMiddlewareName: string,
  middlewareName: string
) {
  const targetIndex = findMiddlewareIndex(stack, targetMiddlewareName)
  const prependIndex = findMiddlewareIndex(stack, middlewareName)

  const prependItem = stack.splice(prependIndex, 1)[0]
  if (typeof prependItem === 'undefined') throw new Error()

  stack.splice(targetIndex, 0, prependItem)
}
