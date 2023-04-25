import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  assert,
  assertFontDefinition,
  assertObject,
  assertString
} from './assert'

const ERROR_MSG = 'error'

describe('assert', () => {
  it('should pass if condition is met', () => {
    expectTypeOf(assert).toBeFunction()
    expect(assert(true)).toBe(undefined)
    expect(() => assert(false, ERROR_MSG)).toThrowError(ERROR_MSG)
  })
})

describe('assertObject', () => {
  it('should pass if value is non-nullish object', () => {
    expectTypeOf(assertObject).toBeFunction()
    expect(assert({})).toBe(undefined)
    expect(() => assertObject(null)).toThrowError()
    expect(() => assertObject(undefined)).toThrowError()
  })
})

describe('assertString', () => {
  it('should pass if value is string', () => {
    expectTypeOf(assertString).toBeFunction()
    expect(assertString('')).toBe(undefined)
    expect(assertString('foo')).toBe(undefined)
    expect(() => assertObject(null)).toThrowError()
    expect(() => assertObject(undefined)).toThrowError()
  })
})

describe('assertFontDefinition', () => {
  it('should pass if value is of FontDefinition type', () => {
    expectTypeOf(assertFontDefinition).toBeFunction()
    expect(
      assertFontDefinition({
        name: 'foo',
        src: 'bar'
      })
    ).toBe(undefined)
    expect(() => assertFontDefinition({ name: 'foo' })).toThrowError()
    expect(() => assertFontDefinition({ src: 'foo' })).toThrowError()
    expect(() => assertFontDefinition(null)).toThrowError()
    expect(() => assertFontDefinition(undefined)).toThrowError()
  })
})
