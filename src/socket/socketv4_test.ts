import { assert } from '@std/assert/assert'
import { assertEquals } from '@std/assert/equals'
import { assertInstanceOf } from '@std/assert/instance-of'
import { Ipv4Addr } from '../mod.ts'
import { Port, SocketAddrV4 } from './socket.ts'

Deno.test('socket address v4: constructor does not validate port number (too small)', () => {
	const socket = new SocketAddrV4(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		new Port(-1),
	)
	assertEquals(socket.port.value, -1)
})

Deno.test('socket address v4: constructor does not validate port number (too big)', () => {
	const socket = new SocketAddrV4(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		new Port(65536),
	)
	assertEquals(socket.port.value, 65536)
})

Deno.test('socket address v4: tryNew is ok', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		8080,
	)
	assertInstanceOf(socket, SocketAddrV4)
})

Deno.test('socket address v4: tryNew errors if port is NaN', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		Number.NaN,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is +Infinity', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		Number.POSITIVE_INFINITY,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is -Infinity', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		Number.NEGATIVE_INFINITY,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is less than 0', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		-1,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: tryNew errors if port is greater than 65,535', () => {
	const socket = SocketAddrV4.tryNew(
		Ipv4Addr.tryNew(127, 0, 0, 1) as Ipv4Addr,
		65536,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v4: parse is ok', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:8080')
	assert(socket instanceof SocketAddrV4)
	assert(socket.addr.equals(Ipv4Addr.LOCALHOST))
	assertEquals(socket.port.value, 8080)
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

Deno.test('socket address v4: to string', () => {
	const socket = SocketAddrV4.parse('0.0.0.0:8080') as SocketAddrV4
	assertEquals(socket.toString(), '0.0.0.0:8080')
})
