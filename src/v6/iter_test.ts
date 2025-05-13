import { assertEquals } from '@std/assert'
import { Ipv6Addr, Ipv6AddrIterator } from './mod.ts'

Deno.test('ipv6 iterator: iterate when begin = end', () => {
	const iter = new Ipv6AddrIterator(
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 0) as Ipv6Addr,
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 0) as Ipv6Addr,
	)

	assertEquals(iter.next().value, null)
})

Deno.test('ipv6 iterator: iterate regularly', () => {
	const iter = new Ipv6AddrIterator(
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 1) as Ipv6Addr,
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 7) as Ipv6Addr,
	)

	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 1))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 2))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 3))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 4))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 5))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 6))
	assertEquals(iter.next().value, null)
})

Deno.test('ipv6 iterator: iterator will overflow to next segment', () => {
	const iter = new Ipv6AddrIterator(
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65530) as Ipv6Addr,
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 1, 0) as Ipv6Addr,
	)

	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65530))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65531))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65532))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65533))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65534))
	assertEquals(iter.next().value, Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65535))
	assertEquals(iter.next().value, null)
})
