import type { FontDefinition } from './types'

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (condition) return
  throw new Error(message)
}

export function assertObject(
  input: unknown
): asserts input is Record<string, unknown> {
  assert(typeof input === 'object' && input, 'Expected object')
}

export function assertString(input: unknown): asserts input is string {
  assert(typeof input === 'string', 'Expected string')
}

export function assertFontDefinition(
  input: unknown
): asserts input is FontDefinition {
  assertObject(input)
  assertString(input.name)
  assertString(input.src)
}
