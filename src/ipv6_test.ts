import { assert, assertEquals, assertFalse, assertNotEquals } from '@std/assert'
import { Ipv6Addr } from './ipv6.ts'

Deno.test('special address localhost', () => {
	const localhost = Ipv6Addr.LOCALHOST
	assertEquals(localhost.a, 0)
	assertEquals(localhost.b, 0)
	assertEquals(localhost.c, 0)
	assertEquals(localhost.d, 0)
	assertEquals(localhost.e, 0)
	assertEquals(localhost.f, 0)
	assertEquals(localhost.g, 0)
	assertEquals(localhost.h, 1)
})

Deno.test('special address unspecified', () => {
	const localhost = Ipv6Addr.UNSPECIFIED
	assertEquals(localhost.a, 0)
	assertEquals(localhost.b, 0)
	assertEquals(localhost.c, 0)
	assertEquals(localhost.d, 0)
	assertEquals(localhost.e, 0)
	assertEquals(localhost.f, 0)
	assertEquals(localhost.g, 0)
	assertEquals(localhost.h, 0)
})

Deno.test('segments', () => {
	const addr = Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8)
	assertEquals(
		addr.segments(),
		new Uint16Array([1, 2, 3, 4, 5, 6, 7, 8]),
	)
})

Deno.test('new address', () => {
	const addr = Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8)
	assertEquals(addr.a, 1)
	assertEquals(addr.b, 2)
	assertEquals(addr.c, 3)
	assertEquals(addr.d, 4)
	assertEquals(addr.e, 5)
	assertEquals(addr.f, 6)
	assertEquals(addr.g, 7)
	assertEquals(addr.h, 8)
})

Deno.test('from uint128 clamps to min', () => {
	const addr = Ipv6Addr.fromUint128(-1n)
	assertEquals(addr.a, 0)
	assertEquals(addr.b, 0)
	assertEquals(addr.c, 0)
	assertEquals(addr.d, 0)
	assertEquals(addr.e, 0)
	assertEquals(addr.f, 0)
	assertEquals(addr.g, 0)
	assertEquals(addr.h, 0)
})

Deno.test('from uint128 clamps to max', () => {
	const addr = Ipv6Addr.fromUint128(2n ** 128n)
	assertEquals(addr.a, 65_535)
	assertEquals(addr.b, 65_535)
	assertEquals(addr.c, 65_535)
	assertEquals(addr.d, 65_535)
	assertEquals(addr.e, 65_535)
	assertEquals(addr.f, 65_535)
	assertEquals(addr.g, 65_535)
	assertEquals(addr.h, 65_535)
})

Deno.test('try from array is ok', () => {
	const addr = Ipv6Addr.tryFromArray([1, 2, 3, 4, 5, 6, 7, 8])
	assert(addr instanceof Ipv6Addr)
	assertEquals(addr.a, 1)
	assertEquals(addr.b, 2)
	assertEquals(addr.c, 3)
	assertEquals(addr.d, 4)
	assertEquals(addr.e, 5)
	assertEquals(addr.f, 6)
	assertEquals(addr.g, 7)
	assertEquals(addr.h, 8)
})

Deno.test('try from array is error', () => {
	const addr = Ipv6Addr.tryFromArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
	assertEquals(addr, null)
})

Deno.test('try from uint16array is ok', () => {
	const addr = Ipv6Addr.tryFromUint16Array(
		new Uint16Array([1, 2, 3, 4, 5, 6, 7, 8]),
	)
	assert(addr instanceof Ipv6Addr)
	assertEquals(addr.a, 1)
	assertEquals(addr.b, 2)
	assertEquals(addr.c, 3)
	assertEquals(addr.d, 4)
	assertEquals(addr.e, 5)
	assertEquals(addr.f, 6)
	assertEquals(addr.g, 7)
	assertEquals(addr.h, 8)
})

Deno.test('try from uint16array is error', () => {
	const addr = Ipv6Addr.tryFromUint16Array(
		new Uint16Array([1, 2, 3, 4, 5, 6, 7, 8, 9]),
	)
	assertEquals(addr, null)
})

Deno.test('try from dataview is ok', () => {
	const addr = Ipv6Addr.tryFromDataView(new DataView(new ArrayBuffer(16)))
	assert(addr instanceof Ipv6Addr)
})

Deno.test('try from dataview is error', () => {
	const addr = Ipv6Addr.tryFromDataView(new DataView(new ArrayBuffer(17)))
	assertEquals(addr, null)
})

Deno.test('to uint128 from ::', () => {
	const addr = Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 0)
	assertEquals(addr.toUint128(), 0n)
})

Deno.test('to uint128 from ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
	const addr = Ipv6Addr.newAddr(
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
	)
	assertEquals(addr.toUint128(), (2n ** 128n) - 1n)
})

Deno.test('localhost to full string', () => {
	const localhost = Ipv6Addr.LOCALHOST
	assertEquals(
		localhost.toString(),
		'0000:0000:0000:0000:0000:0000:0000:0001',
	)
})

Deno.test('address with hex characters to full string', () => {
	const addr = Ipv6Addr.newAddr(
		0x1234,
		0x5678,
		0x9abc,
		0xdef0,
		0x1234,
		0x5678,
		0x9abc,
		0xdef0,
	)
	assertEquals(addr.toString(), '1234:5678:9abc:def0:1234:5678:9abc:def0')
})

Deno.test('previous: :: -> null', () => {
	const addr = Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 0)
	assertEquals(addr.previous(), null)
})

Deno.test('previous: before max segment', () => {
	const addr = Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 65535)
	assertEquals(
		addr.previous(),
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 65534),
	)
})

Deno.test('previous: underflow to previous segment', () => {
	const addr = Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 1, 0)
	assertEquals(addr.previous(), Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 65535))
})

Deno.test('next: max ipv6 address -> null', () => {
	const addr = Ipv6Addr.newAddr(
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
		0xffff,
	)
	assertEquals(addr.next(), null)
})

Deno.test('next: :: -> ::1', () => {
	const addr = Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 0)
	assertEquals(
		addr.next(),
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 1),
	)
})

Deno.test('next: ::ffff -> ::1:0', () => {
	const addr = Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 0xffff)
	assertEquals(
		addr.next(),
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 1, 0),
	)
})

Deno.test('octets', () => {
	const addr = Ipv6Addr.newAddr(0xff00, 0, 0, 0, 0, 0, 0, 0)
	assertEquals(
		addr.octets(),
		new Uint8Array([255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
	)
})

Deno.test('equals', () => {
	const addr1 = Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8)
	const addr2 = Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8)
	assert(addr1.equals(addr2))
})

// deno-fmt-ignore
Deno.test('is benchmarking', () => {
	assertFalse(Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc613, 0x0).isBenchmarking())
	assert(Ipv6Addr.newAddr(0x2001, 0x2, 0, 0, 0, 0, 0, 0).isBenchmarking())
})

// deno-fmt-ignore
Deno.test('is documentation', () => {
	assertFalse(Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc00a, 0x2ff).isDocumentation())
	assert(Ipv6Addr.newAddr(0x2001, 0xdb8, 0, 0, 0, 0, 0, 0).isDocumentation())
})

// deno-fmt-ignore
Deno.test('is global: unspecified is not', () => {
	assertFalse(Ipv6Addr.UNSPECIFIED.isGlobal())
})

Deno.test('is global: localhost is not', () => {
	assertFalse(Ipv6Addr.LOCALHOST.isGlobal())
})

Deno.test('is global: ipv4 mapped is not', () => {
	assertFalse(
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc00a, 0x2ff).isGlobal(),
	)
})

Deno.test('is global: benchmarking is not', () => {
	assertFalse(Ipv6Addr.newAddr(0x2001, 2, 0, 0, 0, 0, 0, 1).isGlobal())
})

Deno.test('is global: documentation is not', () => {
	assertFalse(Ipv6Addr.newAddr(0x2001, 0xdb8, 0, 0, 0, 0, 0, 0).isGlobal())
	assertFalse(Ipv6Addr.newAddr(0x2001, 0xdb8, 0, 0, 0, 0, 0, 1).isGlobal())
})

Deno.test('is global: yes', () => {
	assert(Ipv6Addr.newAddr(0x26, 0, 0x1c9, 0, 0, 0xafc8, 0x10, 0x1).isGlobal())
})

Deno.test('is global: unicast address with link-local scope', () => {
	assertFalse(Ipv6Addr.newAddr(0xfe80, 0, 0, 0, 0, 0, 0, 0).isGlobal())
	assertFalse(Ipv6Addr.newAddr(0xfe81, 0, 0, 0, 0, 0, 0, 1).isGlobal())
})

Deno.test('is global: unique local address is not', () => {
	assertFalse(Ipv6Addr.newAddr(0xfc00, 0, 0, 0, 0, 0, 0, 0).isGlobal())
	assertFalse(Ipv6Addr.newAddr(0xfc02, 0, 0, 0, 0, 0, 0, 1).isGlobal())
})

Deno.test('is global: 1st hextet as 0x2002 is not', () => {
	assertFalse(Ipv6Addr.newAddr(0x2002, 0, 0, 0, 0, 0, 0, 0).isGlobal())
})

Deno.test('is loopback', () => {
	assertFalse(
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc00a, 0x2ff).isLoopback(),
	)
	assert(Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0, 0, 1).isLoopback())
})

Deno.test('is multicast', () => {
	assert(Ipv6Addr.newAddr(0xff00, 0, 0, 0, 0, 0, 0, 0).isMulticast())
	assertFalse(
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc00a, 0x2ff).isMulticast(),
	)
})

Deno.test('is unicast', () => {
	assert(Ipv6Addr.LOCALHOST.isUnicast())
	assert(Ipv6Addr.UNSPECIFIED.isUnicast())
	assert(Ipv6Addr.newAddr(0x2001, 0xdb8, 0, 0, 0, 0, 0, 0).isUnicast())
	assertFalse(Ipv6Addr.newAddr(0xff00, 0, 0, 0, 0, 0, 0, 0).isUnicast())
})

Deno.test('is globally unicast', () => {
	assertFalse(
		Ipv6Addr.newAddr(0x2001, 0xdb8, 0, 0, 0, 0, 0, 0).isUnicastGlobal(),
	)
	assert(
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc00a, 0x2ff)
			.isUnicastGlobal(),
	)
})

Deno.test('is link-local unicast', () => {
	assertFalse(Ipv6Addr.LOCALHOST.isUnicastLinkLocal())
	assertFalse(
		Ipv6Addr.newAddr(0x2001, 0xdb8, 0, 0, 0, 0, 0, 0).isUnicastLinkLocal(),
	)
	assert(Ipv6Addr.newAddr(0xfe80, 0, 0, 0, 0, 0, 0, 0).isUnicastLinkLocal())
	assert(Ipv6Addr.newAddr(0xfe80, 0, 0, 1, 0, 0, 0, 0).isUnicastLinkLocal())
	assert(Ipv6Addr.newAddr(0xfe81, 0, 0, 0, 0, 0, 0, 0).isUnicastLinkLocal())
})

Deno.test('is unique local', () => {
	assertFalse(
		Ipv6Addr.newAddr(0, 0, 0, 0, 0, 0xffff, 0xc00a, 0x2ff).isUniqueLocal(),
	)
	assert(Ipv6Addr.newAddr(0xfc02, 0, 0, 0, 0, 0, 0, 0).isUniqueLocal())
})

Deno.test('is unspecified', () => {
	assert(Ipv6Addr.UNSPECIFIED.isUnspecified())
	assertFalse(Ipv6Addr.LOCALHOST.isUnspecified())
})

Deno.test('multicast scope: interface local', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xff01, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'InterfaceLocal',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff1, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'InterfaceLocal',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xff02, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'InterfaceLocal',
	)
})

Deno.test('multicast scope: link local', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xff02, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'LinkLocal',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff2, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'LinkLocal',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xff05, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'LinkLocal',
	)
})

Deno.test('multicast scope: realm local', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xff03, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'RealmLocal',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff3, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'RealmLocal',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xff04, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'RealmLocal',
	)
})

Deno.test('multicast scope: admin local', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff4, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'AdminLocal',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff4, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'AdminLocal',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xff05, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'AdminLocal',
	)
})

Deno.test('multicast scope: site local', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xff05, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'SiteLocal',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff5, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'SiteLocal',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xff08, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'SiteLocal',
	)
})

Deno.test('multicast scope: organization local', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xff08, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'OrganizationLocal',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfff8, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'OrganizationLocal',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xff0e, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'OrganizationLocal',
	)
})

Deno.test('multicast scope: global', () => {
	// min hextet
	assertEquals(
		Ipv6Addr.newAddr(0xff0e, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'Global',
	)
	// max hextet
	assertEquals(
		Ipv6Addr.newAddr(0xfffe, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'Global',
	)
	// outside of range
	assertNotEquals(
		Ipv6Addr.newAddr(0xffff, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		'Global',
	)
})

Deno.test('multicast scope: unknown', () => {
	assertEquals(
		Ipv6Addr.LOCALHOST.multicastScope(),
		null,
	)
	assertEquals(
		Ipv6Addr.newAddr(0xffff, 0, 0, 0, 0, 0, 0, 0).multicastScope(),
		null,
	)
})
