import { assert, assertEquals } from '@std/assert'
import { Ipv4Addr } from './ipv4.ts'
import { SocketAddrV4 } from './socket.ts'

Deno.test('socket addresss v4: parse is ok', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:8080')
	assert(socket instanceof SocketAddrV4)
	assert(socket.addr.equals(Ipv4Addr.LOCALHOST))
	assertEquals(socket.port, 8080)
})

Deno.test('socket address v4: parse is error, empty string', () => {
	const socket = SocketAddrV4.parse('')
	assertEquals(socket, undefined)
})

Deno.test('socket address v4: parse is error, no ipv4 address', () => {
	const socket = SocketAddrV4.parse(':8080')
	assertEquals(socket, undefined)
})

Deno.test('socket address v4: parse is error, invalid ipv4 address', () => {
	const socket = SocketAddrV4.parse('256.0.0.1:8080')
	assertEquals(socket, undefined)
})

Deno.test('socket address v4: parse is error, no colon delimiter', () => {
	const socket = SocketAddrV4.parse('127.0.0.1!8080')
	assertEquals(socket, undefined)
})

Deno.test('socket address v4: parse is error, no port', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:')
	assertEquals(socket, undefined)
})

Deno.test('socket address v4: parse is error, port is out of bounds', () => {
	const socket = SocketAddrV4.parse('127.0.0.1:65536')
	assertEquals(socket, undefined)
})
