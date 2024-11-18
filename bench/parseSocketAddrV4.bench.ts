import { Ipv4Addr, SocketAddrV4 } from '../src/mod.ts'
import {
	randomAddress,
	randomPort,
	// randomWellKnownPort,
} from './getRandomAddress.ts'

const sockets: string[] = []
for (let i = 0; i < 100_000; i++) {
	sockets.push(`${randomAddress()}:${randomPort()}`)
}

// precompile regular expressions
const looseRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3}):(\d{1,5})$/

const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)'
const port =
	'(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])'
const strictRegex = new RegExp(`^${octet}\.${octet}.${octet}.${octet}:${port}`)

// benchmarks
Deno.bench('parse+create socket address v4 with regex, loose', () => {
	for (const socket of sockets) {
		const result = socket.match(looseRegex) as RegExpMatchArray
		const ip = Ipv4Addr.newAddr(
			Number.parseInt(result[1], 10),
			Number.parseInt(result[2], 10),
			Number.parseInt(result[3], 10),
			Number.parseInt(result[4], 10),
		)
		const port = Number.parseInt(result[5])
		new SocketAddrV4(ip, port)
	}
})

Deno.bench('parse+create socket address v4 with regex, strict', () => {
	for (const socket of sockets) {
		const result = socket.match(strictRegex) as RegExpMatchArray
		const ip = Ipv4Addr.tryFromUint8Array(
			new Uint8Array([
				Number.parseInt(result[1], 10),
				Number.parseInt(result[2], 10),
				Number.parseInt(result[3], 10),
				Number.parseInt(result[4], 10),
			]),
		) as Ipv4Addr
		const port = Number.parseInt(result[5])
		new SocketAddrV4(ip, port)
	}
})

Deno.bench({
	name: 'parse+create socket address v4 with handwritten',
	baseline: true,
}, () => {
	for (const socket of sockets) {
		SocketAddrV4.parse(socket)
	}
})
