import { assertEquals } from '@std/assert/equals'
import { assertInstanceOf } from '@std/assert/instance-of'
import { Ipv6Addr } from '../mod.ts'
import { Port, SocketAddrV6 } from './socket.ts'

Deno.test('socket address v6: constructor does not validate port number (too small)', () => {
	const socket = new SocketAddrV6(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		new Port(-1),
		0,
		0,
	)
	assertEquals(socket.port.value, -1)
})

Deno.test('socket address v6: constructor does not validate port number (too big)', () => {
	const socket = new SocketAddrV6(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		new Port(65536),
		0,
		0,
	)
	assertEquals(socket.port.value, 65536)
})

Deno.test('socket address v6: tryNew is ok', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		8080,
		0,
		0,
	)
	assertInstanceOf(socket, SocketAddrV6)
})

Deno.test('socket address v6: tryNew errors if port is NaN', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		Number.NaN,
		0,
		0,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is +Infinity', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		Number.POSITIVE_INFINITY,
		0,
		0,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is -Infinity', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		Number.NEGATIVE_INFINITY,
		0,
		0,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is less than 0', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		-1,
		0,
		0,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if port is greater than 65,535', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.tryNew(1, 2, 3, 4, 5, 6, 7, 8) as Ipv6Addr,
		65536,
		0,
		0,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if flow info is not a uint32', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.LOCALHOST,
		3000,
		2 ** 32,
		0,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: tryNew errors if scope id is not a uint32', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.LOCALHOST,
		3000,
		0,
		2 ** 32,
	)
	assertEquals(socket, null)
})

Deno.test('socket address v6: to string when scope id is 0', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.LOCALHOST,
		3000,
		0,
		0,
	)
	assertInstanceOf(socket, SocketAddrV6)
	assertEquals(
		socket.toString(),
		'[::1]:3000',
	)
})

Deno.test('socket address v6: to string when scope id is not 0', () => {
	const socket = SocketAddrV6.tryNew(
		Ipv6Addr.LOCALHOST,
		3000,
		0,
		1,
	)
	assertInstanceOf(socket, SocketAddrV6)
	assertEquals(
		socket.toString(),
		'[::1%1]:3000',
	)
})
