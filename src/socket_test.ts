import { assert } from '@std/assert/assert'
import { assertEquals } from '@std/assert/equals'
import { assertInstanceOf } from '@std/assert/instance-of'
import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './ipv6.ts'
import { SocketAddrV4 } from './socket.ts'
import { SocketAddrV6 } from './socket.ts'

Deno.test('socket address v4: tryNew is ok', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.newAddr(127, 0, 0, 1),
		8080,
	)
	assertInstanceOf(socket, SocketAddrV4)
})

Deno.test('socket address v4: tryNew errors if port is NaN', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.newAddr(127, 0, 0, 1),
		Number.NaN,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is +Infinity', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.newAddr(127, 0, 0, 1),
		Number.POSITIVE_INFINITY,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is -Infinity', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.newAddr(127, 0, 0, 1),
		Number.NEGATIVE_INFINITY,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is less than 0', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.newAddr(127, 0, 0, 1),
		-1,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is greater than 65,535', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.newAddr(127, 0, 0, 1),
		65536,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is ok', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:8080')
	assert(socket instanceof SocketAddrV4)
	assert(socket.addr.equals(Ipv4Addr.LOCALHOST))
	assertEquals(socket.port, 8080)
})

Deno.test('socket address v4: parse is error, empty string', () => {
	const socket = SocketAddrV4.parse('')
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is error, no ipv4 address', () => {
	const socket = SocketAddrV4.parse(':8080')
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is error, invalid ipv4 address', () => {
	const socket = SocketAddrV4.parse('256.0.0.1:8080')
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is error, no colon delimiter', () => {
	const socket = SocketAddrV4.parse('127.0.0.1!8080')
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is error, no port', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:')
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is error, port is out of bounds', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:65536')
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew is ok', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8),
		8080,
	)
	assertInstanceOf(socket, SocketAddrV6)
})

Deno.test('socket address v6: tryNew errors if port is NaN', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8),
		Number.NaN,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is +Infinity', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8),
		Number.POSITIVE_INFINITY,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is -Infinity', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8),
		Number.NEGATIVE_INFINITY,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is less than 0', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8),
		-1,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is greater than 65,535', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.newAddr(1, 2, 3, 4, 5, 6, 7, 8),
		65536,
	)
	assertEquals(socket, null)
})
