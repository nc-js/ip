import { assertEquals } from '@std/assert'
import { arrayStartsWith } from './utils.ts'

Deno.test('array starts with: false if b is longer', () => {
	const a = new Uint8Array([1, 2, 3])
	const b = new Uint8Array([1, 2, 3, 4])
	assertEquals(arrayStartsWith(a, b), false)
})
