import { assert } from '@std/assert/assert'
import { assertEquals } from '@std/assert/equals'
import { assertFalse } from '@std/assert/false'
import { assertInstanceOf } from '@std/assert/instance-of'
import { randomIntegerBetween } from '@std/random/integer-between'
import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './ipv6.ts'
import { Port, SocketAddr } from './socket.ts'
import { SocketAddrV4 } from './socket.ts'
import { SocketAddrV6 } from './socket.ts'

Deno.test('port: create a system port', () => {
	const port = Port.tryNew(randomIntegerBetween(0, 1023))
	assertInstanceOf(port, Port)
	assert(port.isSystem)
})

Deno.test('port: create a user port', () => {
	const port = Port.tryNew(randomIntegerBetween(1024, 49151))
	assertInstanceOf(port, Port)
	assert(port.isUser)
})

Deno.test('port: create a dynamic port', () => {
	const port = Port.tryNew(randomIntegerBetween(49152, 65535))
	assertInstanceOf(port, Port)
	assert(port.isDyanmic)
})

Deno.test('port: create a reserved port', () => {
	assert(new Port(0).isReserved)
	assert(new Port(1023).isReserved)
	assert(new Port(1024).isReserved)
	assert(new Port(1023).isReserved)
	assert(new Port(49151).isReserved)
	assert(new Port(49152).isReserved)
	assert(new Port(65535).isReserved)
	assertFalse(new Port(5).isReserved)
})

Deno.test('port: create a selectable ephemeral port', () => {
	const port = Port.tryNew(randomIntegerBetween(1024, 65535))
	assertInstanceOf(port, Port)
	assert(port.isSelectableEphemeral)

	// to be safe, check min and max
	const minPort = new Port(1024)
	assert(minPort.isSelectableEphemeral)

	const maxPort = new Port(65535)
	assert(maxPort.isSelectableEphemeral)
})

Deno.test('socket address: get port', () => {
	const innerv4 = new SocketAddrV4(Ipv4Addr.LOCALHOST, new Port(3000))
	const v4 = new SocketAddr(innerv4)
	assertEquals(v4.port.value, 3000)

	const innerv6 = new SocketAddrV6(Ipv6Addr.LOCALHOST, new Port(3000), 0, 0)
	const v6 = new SocketAddr(innerv6)
	assertEquals(v6.port.value, 3000)
})

Deno.test('socket address: get ip address', () => {
	const innerv4 = new SocketAddrV4(Ipv4Addr.LOCALHOST, new Port(3000))
	const v4 = new SocketAddr(innerv4)
	assertEquals(v4.addr, Ipv4Addr.LOCALHOST)

	const innerv6 = new SocketAddrV6(Ipv6Addr.LOCALHOST, new Port(3000), 0, 0)
	const v6 = new SocketAddr(innerv6)
	assertEquals(v6.addr, Ipv6Addr.LOCALHOST)
})

Deno.test('socket address: get v4 as string', () => {
	const innerv4 = new SocketAddrV4(Ipv4Addr.LOCALHOST, new Port(3000))
	const v4 = new SocketAddr(innerv4)
	assertEquals(v4.toString(), '127.0.0.1:3000')
})

Deno.test('socket address: get v6 as string', () => {
	const innerv6 = new SocketAddrV6(Ipv6Addr.LOCALHOST, new Port(3000), 0, 0)
	const v6 = new SocketAddr(innerv6)
	assertEquals(
		v6.toString(),
		'[0000:0000:0000:0000:0000:0000:0000:0001]:3000',
	)
})

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
