import { assertEquals } from '@std/assert/equals'
import { Ipv4Addr } from './../v4/mod.ts'
import { Ipv6Addr } from './../v6/mod.ts'
import { Port, SocketAddr, SocketAddrV4, SocketAddrV6 } from './socket.ts'

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
