import { describe, expect, expectTypeOf, it } from 'vitest'

import { extractFormat, extractStyle, extractWeight } from './font'

describe('extractFormat', () => {
  it('should extract format from filename', () => {
    const filename = 'Foo-RegularItalic'

    expectTypeOf(extractFormat).toBeFunction()
    expectTypeOf(extractFormat(filename)).toBeString()
    expect(extractFormat(filename + '.woff')).toBe('woff')
    expect(extractFormat(filename + '.woff2')).toBe('woff2')
    expect(extractFormat(filename + '.ttf')).toBe('truetype')
    expect(extractFormat(filename + '.otf')).toBe('opentype')
    expect(extractFormat(filename + '.svg')).toBe('svg')
    expect(extractFormat(filename + '.foo')).toBe('foo')
  })
})

describe('extractWeight', () => {
  it('should extract font weight from filename', () => {
    expectTypeOf(extractWeight).toBeFunction()
    expectTypeOf(extractWeight('')).toBeNumber()
    expect(extractWeight('')).toBe(400)
    expect(extractWeight('Foo-Thin.woff')).toBe(100)
    expect(extractWeight('Foo-ExtraLight.woff')).toBe(200)
    expect(extractWeight('Foo-UltraLight.woff')).toBe(200)
    expect(extractWeight('Foo-Light.woff')).toBe(300)
    expect(extractWeight('Foo.woff')).toBe(400)
    expect(extractWeight('Foo-Normal.woff')).toBe(400)
    expect(extractWeight('Foo-Regular.woff')).toBe(400)
    expect(extractWeight('Foo-Medium.woff')).toBe(500)
    expect(extractWeight('Foo-Semibold.woff')).toBe(600)
    expect(extractWeight('Foo-Demibold.woff')).toBe(600)
    expect(extractWeight('Foo-Bold.woff')).toBe(700)
    expect(extractWeight('Foo-Extrabold.woff')).toBe(800)
    expect(extractWeight('Foo-Ultrabold.woff')).toBe(800)
    expect(extractWeight('Foo-Black.woff')).toBe(900)
    expect(extractWeight('Foo-Heavy.woff')).toBe(900)
  })
})

describe('extractStyle', () => {
  it('should extract font style from filename', () => {
    expectTypeOf(extractStyle).toBeFunction()
    expectTypeOf(extractStyle('')).toBeString()
    expect(extractStyle('')).toBe('normal')
    expect(extractStyle('Foo.woff')).toBe('normal')
    expect(extractStyle('Foo-Normal.woff')).toBe('normal')
    expect(extractStyle('Foo-Italic.woff')).toBe('italic')
    expect(extractStyle('Foo-Oblique.woff')).toBe('oblique')
  })
})
