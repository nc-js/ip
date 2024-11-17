import { Ipv4Addr } from '../src/mod.ts'
import { getRandomAddress } from './getRandomAddress.ts'

const addresses: string[] = []
for(let i = 0; i < 100_000; i++) {
	addresses.push(getRandomAddress())
}

Deno.bench('parse+create ipv4 address with regex, 1', () => {
	const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
	for(const addr of addresses) {
		const result = addr.match(regex) as RegExpMatchArray
		Ipv4Addr.newAddr(
			Number.parseInt(result[1], 10),
			Number.parseInt(result[2], 10),
			Number.parseInt(result[3], 10),
			Number.parseInt(result[4], 10)
		)
	}
})

// Stricter regex which also checks that integers are between 0-255
Deno.bench('parse+create ipv4 address with regex, 2', () => {
	const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)'
	const regex = new RegExp(`^${octet}\.${octet}\.${octet}\.${octet}$`)

	for(const addr of addresses) {
		const result = addr.match(regex) as RegExpMatchArray
		Ipv4Addr.newAddr(
			Number.parseInt(result[1], 10),
			Number.parseInt(result[2], 10),
			Number.parseInt(result[3], 10),
			Number.parseInt(result[4], 10)
		)
	}
})

Deno.bench({ name: 'parse+create ipv4 address with handwritten', baseline: true }, () => {
	for(const addr of addresses) {
		Ipv4Addr.parse(addr)
	}
})
