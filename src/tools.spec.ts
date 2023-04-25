import { sep } from 'node:path'

import { describe, expect, expectTypeOf, it } from 'vitest'

import { findMiddlewareIndex, prependMiddleware, toForwardSlash } from './tools'

describe('toForwardSlash', () => {
  it('should always return forward slash path string', () => {
    expectTypeOf(toForwardSlash).toBeFunction()
    expectTypeOf(toForwardSlash('')).toBeString()
    expect(toForwardSlash('')).toBe('')
    expect(toForwardSlash('/foo/bar/baz/')).toBe('/foo/bar/baz/')
    expect(toForwardSlash(['foo', 'bar', 'baz'].join(sep))).toBe('foo/bar/baz')
  })
})

describe('findMiddlewareIndex', () => {
  it('should find index of middleware', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function foo() {}
    const stack = [{ route: '', handle: foo }]

    expectTypeOf(findMiddlewareIndex).toBeFunction()
    expect(findMiddlewareIndex(stack, 'foo')).toBe(0)
    expect(findMiddlewareIndex(stack, 'bar')).toBe(-1)
  })
})

describe('prependMiddleware', () => {
  it('should be function', () => {
    expectTypeOf(prependMiddleware).toBeFunction()
  })

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function foo() {}
  const target = { route: 'foo', handle: foo }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function bar() {}
  const middleware = { route: 'bar', handle: bar }

  it('should prepend middleware before another one', () => {
    const stack = [target, middleware]
    expect(prependMiddleware(stack, 'foo', 'bar')).toBe(undefined)
    expect(findMiddlewareIndex(stack, 'bar')).toBe(0)
  })

  it('should prepend middleware at the begining if target does not exist', () => {
    const stack = [{ route: 'baz', handle: () => void 0 }, middleware]
    expect(prependMiddleware(stack, 'foo', 'bar')).toBe(undefined)
    expect(findMiddlewareIndex(stack, 'bar')).toBe(0)
  })

  it('should skip the operation when middleware is not present in stack', () => {
    const stack = [target]
    expect(prependMiddleware(stack, 'foo', 'bar')).toBe(undefined)
    expect(findMiddlewareIndex(stack, 'bar')).toBe(-1)
  })
})
