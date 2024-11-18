import { Ipv4Addr } from './ipv4.ts'
import { takeAsciiDigits } from './utils.ts'

/**
 * - A tuple where:
 * - the first member is either the resulting type, or null
 * - the second member is the index where the parser finally left off at
 */
type ParseResult<T> = [T | null, number]

export function parseIpv4Addr(s: string): ParseResult<Ipv4Addr> {
	const array = new Uint8Array(4)
	let seenDots = 0
	let idx = 0

	while (seenDots <= 3) {
		const [octetString, newIdx] = takeAsciiDigits(s, idx)

		// parse octet
		const octetNumber: number = Number.parseInt(octetString, 10)
		if (octetNumber < 0 || octetNumber > 255) {
			return [null, idx]
		}
		array[seenDots] = octetNumber
		idx = newIdx

		// check for next dot
		if (seenDots < 3) {
			if (s[newIdx] !== '.') {
				return [null, idx]
			}
			idx++
		}
		seenDots++
	}

	return [Ipv4Addr.tryFromUint8Array(array), idx]
}
