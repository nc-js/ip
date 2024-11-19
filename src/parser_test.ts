import { assertEquals } from '@std/assert'
import { parseIpv4Addr } from './parser.ts'
import { Ipv4Addr } from './ipv4.ts'

Deno.test('parseIpv4Addr is relaxed, only parses up to valid input', () => {
	const s = '127.0.0.1...'
	const [ip, index] = parseIpv4Addr(s)

	assertEquals(ip, Ipv4Addr.newAddr(127, 0, 0, 1))
	assertEquals(index, 9)
	assertEquals(s.slice(index), '...')
})
