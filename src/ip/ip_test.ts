import { assert, assertFalse } from '@std/assert'
import { IpAddr, Ipv4Addr, Ipv6Addr } from './mod.ts'
import { assertEquals } from '@std/assert/equals'

Deno.test('ip address v4 basic method + property checks', () => {
	const ip = new IpAddr(Ipv4Addr.LOCALHOST)
	assert(ip.isLoopback())
	assertFalse(ip.isMulticast())
	assertFalse(ip.isUnspecified())
	assertFalse(ip.isBenchmarking())
	assertFalse(ip.isDocumentation())
	assertEquals(ip.octets(), new Uint8Array([127, 0, 0, 1]))
})

Deno.test('ip address v4 equals', () => {
	const ipv4_1 = new IpAddr(Ipv4Addr.LOCALHOST)
	const ipv4_2 = new IpAddr(Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr)
	assert(ipv4_1.equals(ipv4_2))

	const ipv6 = new IpAddr(Ipv6Addr.LOCALHOST)
	assertFalse(ipv4_1.equals(ipv6))
})

Deno.test('ip address v6 basic method + property checks', () => {
	const ip = new IpAddr(Ipv6Addr.LOCALHOST)
	assert(ip.isLoopback())
	assertFalse(ip.isMulticast())
	assertFalse(ip.isUnspecified())
	assertFalse(ip.isBenchmarking())
	assertFalse(ip.isDocumentation())
	assertEquals(
		ip.octets(),
		new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]),
	)
})

Deno.test('ip address v6 equals', () => {
	const ipv6_1 = new IpAddr(Ipv6Addr.LOCALHOST)
	const ipv6_2 = new IpAddr(
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 1) as Ipv6Addr,
	)
	assert(ipv6_1.equals(ipv6_2))

	const ipv4 = new IpAddr(Ipv4Addr.LOCALHOST)
	assertFalse(ipv6_1.equals(ipv4))
})
