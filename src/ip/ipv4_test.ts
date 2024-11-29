import { assert, assertEquals, assertFalse } from '@std/assert'
import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './ipv6.ts'

Deno.test('special address broadcast', () => {
	const localhost = Ipv4Addr.BROADCAST
	assertEquals(localhost.a, 255)
	assertEquals(localhost.b, 255)
	assertEquals(localhost.c, 255)
	assertEquals(localhost.d, 255)
})

Deno.test('special address localhost', () => {
	const localhost = Ipv4Addr.LOCALHOST
	assertEquals(localhost.a, 127)
	assertEquals(localhost.b, 0)
	assertEquals(localhost.c, 0)
	assertEquals(localhost.d, 1)
})

Deno.test('special address unspecified', () => {
	const localhost = Ipv4Addr.UNSPECIFIED
	assertEquals(localhost.a, 0)
	assertEquals(localhost.b, 0)
	assertEquals(localhost.c, 0)
	assertEquals(localhost.d, 0)
})

Deno.test('getters', () => {
	const addr = Ipv4Addr.tryNew(1, 2, 3, 4) as Ipv4Addr
	assertEquals(addr.a, 1)
	assertEquals(addr.b, 2)
	assertEquals(addr.c, 3)
	assertEquals(addr.d, 4)
})

Deno.test('from below range of uint32 returns null', () => {
	const addr = Ipv4Addr.tryFromUint32(-1)
	assertEquals(addr, null)
})

Deno.test('from above range uint32 returns null', () => {
	const addr = Ipv4Addr.tryFromUint32(4_294_967_296)
	assertEquals(addr, null)
})

Deno.test('try from array is ok', () => {
	const addr = Ipv4Addr.tryFromArray([1, 2, 3, 4])
	assert(addr instanceof Ipv4Addr)
	assertEquals(addr.a, 1)
	assertEquals(addr.b, 2)
	assertEquals(addr.c, 3)
	assertEquals(addr.d, 4)
})

Deno.test('try from array is error', () => {
	const addr = Ipv4Addr.tryFromArray([1, 2, 3, 4, 5])
	assertEquals(addr, null)
})

Deno.test('try from uint8array is ok', () => {
	const addr = Ipv4Addr.tryFromUint8Array(
		new Uint8Array([
			0,
			0,
			0,
			0,
		]),
	)
	assert(addr instanceof Ipv4Addr)
})

Deno.test('try from uint8array is error', () => {
	const addr = Ipv4Addr.tryFromUint8Array(
		new Uint8Array(
			new ArrayBuffer(5),
		),
	)
	assertEquals(addr, null)
})

Deno.test('try from uint8array is ok', () => {
	const addr = Ipv4Addr.tryFromUint8ClampedArray(
		new Uint8ClampedArray([
			0,
			0,
			0,
			0,
		]),
	)
	assert(addr instanceof Ipv4Addr)
})

Deno.test('try from uint8array is error', () => {
	const addr = Ipv4Addr.tryFromUint8ClampedArray(
		new Uint8ClampedArray(
			new ArrayBuffer(5),
		),
	)
	assertEquals(addr, null)
})

Deno.test('try from dataview is ok', () => {
	const view = new DataView(new ArrayBuffer(4))
	view.setUint8(0, 127)
	view.setUint8(1, 0)
	view.setUint8(2, 0)
	view.setUint8(3, 1)

	const addr = Ipv4Addr.tryFromDataView(view)
	assertEquals(addr, Ipv4Addr.LOCALHOST)
})

Deno.test('try from dataview is error', () => {
	const view = new DataView(new ArrayBuffer(5))
	assertEquals(Ipv4Addr.tryFromDataView(view), null)
})

Deno.test('to uint32 from 0.0.0.0', () => {
	const ip = Ipv4Addr.tryNew(0, 0, 0, 0)
	assertEquals(ip?.toUint32(), 0)
})

Deno.test('to uint32 from 255.255.255.255', () => {
	const ip = Ipv4Addr.tryNew(255, 255, 255, 255)
	assertEquals(ip?.toUint32(), Math.pow(2, 32) - 1)
})

Deno.test('to string', () => {
	const localhost = Ipv4Addr.LOCALHOST
	assertEquals(localhost.toString(), '127.0.0.1')
})

Deno.test('previous: 0.0.0.0 -> null', () => {
	const addr = Ipv4Addr.UNSPECIFIED
	assertEquals(addr.previous(), null)
})

Deno.test('previous: 255.255.255.255 -> 255.255.255.254', () => {
	const addr = Ipv4Addr.BROADCAST
	assertEquals(addr.previous(), Ipv4Addr.tryNew(255, 255, 255, 254))
})

Deno.test('previous: 0.0.1.0 -> 0.0.0.255', () => {
	const addr = Ipv4Addr.tryNew(0, 0, 1, 0)
	assertEquals(addr?.previous(), Ipv4Addr.tryNew(0, 0, 0, 255))
})

Deno.test('next: 255.255.255.255 -> null', () => {
	const addr = Ipv4Addr.BROADCAST
	assertEquals(addr.next(), null)
})

Deno.test('next: 0.0.0.0 -> 0.0.0.1', () => {
	const addr = Ipv4Addr.UNSPECIFIED
	assertEquals(addr.next(), Ipv4Addr.tryNew(0, 0, 0, 1))
})

Deno.test('next: 0.0.0.255 -> 0.0.1.0', () => {
	const addr = Ipv4Addr.tryNew(0, 0, 0, 255)
	assertEquals(addr?.next(), Ipv4Addr.tryNew(0, 0, 1, 0))
})

Deno.test('octets', () => {
	const addr = Ipv4Addr.tryNew(1, 2, 3, 4)
	assertEquals(addr?.octets(), new Uint8Array([1, 2, 3, 4]))
})

Deno.test('equals', () => {
	const addr = Ipv4Addr.tryNew(127, 0, 0, 1)
	assertEquals(addr, Ipv4Addr.LOCALHOST)
})

Deno.test('is benchmarking', () => {
	assert(Ipv4Addr.tryNew(198, 18, 0, 0)?.isBenchmarking())
	assert(Ipv4Addr.tryNew(198, 19, 255, 255)?.isBenchmarking())
	assertFalse(Ipv4Addr.tryNew(198, 17, 255, 255)?.isBenchmarking())
	assertFalse(Ipv4Addr.tryNew(198, 20, 0, 0)?.isBenchmarking())
})

Deno.test('is broadcast', () => {
	assert(Ipv4Addr.tryNew(255, 255, 255, 255)?.isBroadcast())
})

Deno.test('is documentation', () => {
	assert(Ipv4Addr.tryNew(192, 0, 2, 255)?.isDocumentation())
	assert(Ipv4Addr.tryNew(198, 51, 100, 65)?.isDocumentation())
	assert(Ipv4Addr.tryNew(203, 0, 113, 6)?.isDocumentation())
	assertFalse(Ipv4Addr.tryNew(193, 34, 17, 19)?.isDocumentation())
})

Deno.test('is global: unspecified is not', () => {
	assertFalse(Ipv4Addr.UNSPECIFIED.isGlobal())
})

Deno.test('is global: reserved are not', () => {
	assertFalse(Ipv4Addr.tryNew(10, 254, 0, 0)?.isGlobal())
	assertFalse(Ipv4Addr.tryNew(192, 168, 10, 65)?.isGlobal())
	assertFalse(Ipv4Addr.tryNew(172, 16, 10, 65)?.isGlobal())
})

Deno.test('is global: shared is', () => {
	assertFalse(Ipv4Addr.tryNew(100, 100, 0, 0)?.isGlobal())
})

Deno.test('is global: loopback is not', () => {
	assertFalse(Ipv4Addr.LOCALHOST.isGlobal())
})

Deno.test('is global: link local is not', () => {
	assertFalse(Ipv4Addr.tryNew(169, 254, 45, 1)?.isGlobal())
})

Deno.test('is global: documentation is not', () => {
	assertFalse(Ipv4Addr.tryNew(192, 0, 2, 255)?.isGlobal())
	assertFalse(Ipv4Addr.tryNew(198, 51, 100, 65)?.isGlobal())
	assertFalse(Ipv4Addr.tryNew(203, 0, 113, 6)?.isGlobal())
})

Deno.test('is global: benchmarking is not', () => {
	assertFalse(Ipv4Addr.tryNew(198, 18, 0, 0)?.isGlobal())
})

Deno.test('is global: reserved is not', () => {
	assertFalse(Ipv4Addr.tryNew(250, 10, 20, 30)?.isGlobal())
})

Deno.test('is global: broadcast is not', () => {
	assertFalse(Ipv4Addr.BROADCAST.isGlobal())
})

Deno.test('is link local', () => {
	assert(Ipv4Addr.tryNew(169, 254, 0, 0)?.isLinkLocal())
	assert(Ipv4Addr.tryNew(169, 254, 255, 255)?.isLinkLocal())
	assertFalse(Ipv4Addr.tryNew(169, 253, 255, 255)?.isLinkLocal())
	assertFalse(Ipv4Addr.tryNew(169, 255, 0, 0)?.isLinkLocal())
})

Deno.test('is loopback', () => {
	assert(Ipv4Addr.LOCALHOST.isLoopback())
})

Deno.test('is multicast', () => {
	assert(Ipv4Addr.tryNew(224, 0, 0, 0)?.isMulticast())
	assert(Ipv4Addr.tryNew(239, 0, 0, 0)?.isMulticast())
	assertFalse(Ipv4Addr.tryNew(240, 0, 0, 0)?.isMulticast())
})

Deno.test('is private', () => {
	assert(Ipv4Addr.tryNew(10, 0, 0, 1)?.isPrivate())
	assert(Ipv4Addr.tryNew(10, 10, 10, 10)?.isPrivate())
	assert(Ipv4Addr.tryNew(172, 16, 10, 10)?.isPrivate())
	assert(Ipv4Addr.tryNew(172, 29, 45, 14)?.isPrivate())
	assertFalse(Ipv4Addr.tryNew(172, 32, 0, 2)?.isPrivate())
	assert(Ipv4Addr.tryNew(192, 168, 0, 2)?.isPrivate())
	assertFalse(Ipv4Addr.tryNew(192, 169, 0, 2)?.isPrivate())
})

Deno.test('is reserved', () => {
	assert(Ipv4Addr.tryNew(240, 0, 0, 0)?.isReserved())
	assert(Ipv4Addr.tryNew(255, 255, 255, 254)?.isReserved())
	assertFalse(Ipv4Addr.tryNew(239, 255, 255, 255)?.isReserved())
	assertFalse(Ipv4Addr.tryNew(255, 255, 255, 255)?.isReserved())
})

Deno.test('is shared', () => {
	assert(Ipv4Addr.tryNew(100, 64, 0, 0)?.isShared())
	assert(Ipv4Addr.tryNew(100, 127, 255, 255)?.isShared())
	assertFalse(Ipv4Addr.tryNew(100, 128, 0, 0)?.isShared())
})

Deno.test('is unspecified', () => {
	assert(Ipv4Addr.tryNew(0, 0, 0, 0)?.isUnspecified())
})

Deno.test('to ivp6-compatible address', () => {
	const ipv4 = Ipv4Addr.tryNew(192, 0, 2, 255)

	assert(ipv4 instanceof Ipv4Addr)
	assertEquals(
		ipv4.toIpv6Compatible(),
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0xc000, 0x2ff) as Ipv6Addr,
	)
})

Deno.test('to ivp6-mapped address', () => {
	const ipv4 = Ipv4Addr.tryNew(192, 0, 2, 255)

	assert(ipv4 instanceof Ipv4Addr)
	assertEquals(
		ipv4.toIpv6Mapped(),
		Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0xffff, 0xc000, 0x2ff) as Ipv6Addr,
	)
})

Deno.test('parse 127.0.0.1 is ok', () => {
	const addr = Ipv4Addr.parse('127.0.0.1')
	assert(addr instanceof Ipv4Addr)
	assert(addr.equals(Ipv4Addr.LOCALHOST))
})

Deno.test('parse 0.0.0.0 is ok', () => {
	const addr = Ipv4Addr.parse('0.0.0.0')
	assert(addr instanceof Ipv4Addr)
	assert(addr.equals(Ipv4Addr.UNSPECIFIED))
})

Deno.test('parse 255.255.255.255 is ok', () => {
	const addr = Ipv4Addr.parse('255.255.255.255')
	assert(addr instanceof Ipv4Addr)
	assert(addr.equals(Ipv4Addr.BROADCAST))
})

Deno.test('parse errors if minus sign/negative integer appears', () => {
	const maybeIp = Ipv4Addr.parse('255.-255.255.255')
	assertEquals(maybeIp, null)
})

Deno.test('parse errors because number is too big', () => {
	const maybeIp = Ipv4Addr.parse('256.255.255.255')
	assertEquals(maybeIp, null)
})

Deno.test('parse errors because of no dot', () => {
	const maybeIp = Ipv4Addr.parse('127!0.0.1')
	assertEquals(maybeIp, null)
})

Deno.test('parse errors because of too many dots', () => {
	const maybeIp = Ipv4Addr.parse('1.2.3.4.')
	assertEquals(maybeIp, null)
})

Deno.test('parse errors because of too many dots and segments', () => {
	const maybeIp = Ipv4Addr.parse('1.2.3.4.5')
	assertEquals(maybeIp, null)
})
