import { Ipv4Addr } from '../src/mod.ts'
import { getRandomAddress } from './getRandomAddress.ts'

const addresses: string[] = []
for(let i = 0; i < 100_000; i++) {
	addresses.push(getRandomAddress())
}

// precompile regular expressions
const regex1 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)'
const regex2 = new RegExp(`^${octet}\.${octet}\.${octet}\.${octet}$`)

// this uses IPv4Addr.newAddr() because the loose regular expression
// doesn't validate if each integer is between 0-255
Deno.bench('parse+create ipv4 address with regex, loose', () => {
	for(const addr of addresses) {
		const result = addr.match(regex1) as RegExpMatchArray
		Ipv4Addr.newAddr(
			Number.parseInt(result[1], 10),
			Number.parseInt(result[2], 10),
			Number.parseInt(result[3], 10),
			Number.parseInt(result[4], 10)
		)
	}
})

// this uses IPv4Addr.tryFromUint8Array() since IPv4Addr.parse()
// also creates addresses internally with IPv4Addr.tryFromUint8Array()
Deno.bench('parse+create ipv4 address with regex, strict (checks 0-255)', () => {
	for(const addr of addresses) {
		const result = addr.match(regex2) as RegExpMatchArray
		Ipv4Addr.tryFromUint8Array(new Uint8Array([
			Number.parseInt(result[1], 10),
			Number.parseInt(result[2], 10),
			Number.parseInt(result[3], 10),
			Number.parseInt(result[4], 10)
		]))
	}
})

Deno.bench({ name: 'parse+create ipv4 address with handwritten', baseline: true }, () => {
	for(const addr of addresses) {
		Ipv4Addr.parse(addr)
	}
})
