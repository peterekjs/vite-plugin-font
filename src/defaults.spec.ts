import { describe, expectTypeOf, it } from 'vitest'

import { DEFAULT_BASE } from './defaults'

describe('defaults', () => {
  it('should have correct types', () => {
    expectTypeOf(DEFAULT_BASE).toBeString()
  })
})
