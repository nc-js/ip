import { Ipv4Addr } from './ipv4.ts'
import { takeAsciiDigits } from './utils.ts'

/**
 * - A tuple where:
 * - the first member is either the resulting type, or undefined
 * - the second member is the index where the parser finally left off at
 */
type ParseResult<T> = [T | undefined, number]

export function parseIpv4Addr(s: string): ParseResult<Ipv4Addr> {
	const view = new DataView(new ArrayBuffer(4))
	let seenDots = 0
	let idx = 0

	while (seenDots <= 3) {
		const [octetString, newIdx] = takeAsciiDigits(s, idx)

		// parse octet
		const octetNumber: number = Number.parseInt(octetString, 10)
		if (octetNumber < 0 || octetNumber > 255) {
			return [undefined, idx]
		}
		view.setUint8(seenDots, octetNumber)
		idx = newIdx

		// check for next dot
		if (seenDots < 3) {
			if (s[newIdx] !== '.') {
				return [undefined, idx]
			}
			idx++
		}
		seenDots++
	}

	return [Ipv4Addr.tryFromDataView(view), idx]
}
