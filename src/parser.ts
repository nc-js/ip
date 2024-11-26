/**
 * This internal module has slightly "relaxed" parsers. What this means
 * is that it will only parse as much input as is necessary, and will
 * not validate the text that comes after that accepted input.
 *
 * This allows for combining parsers (e.g parsing IPv4 addresses
 * AND port numbers).
 *
 * For example, calling `parseIpv4Addr('127.0.0.1...')` will:
 *  - parse up to '127.0.0.1',
 *  - accept that string and convert it to an `Ipv4Addr`,
 *  - and return an index value of 9 (where the parser last left off at).
 *
 * NOTE, however, that the publicly exposed parser methods will NOT
 * accept extra input.
 * @module
 */

import { Ipv4Addr } from './ipv4.ts'
import { SocketAddrV4 } from './mod.ts'
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
		const [octetString, newIdx] = takeAsciiDigits(s, idx, 1, 3)
		const octetNumber: number = Number.parseInt(octetString, 10)

		// This intentionally does not check if the octet is less than 0,
		// since the previous step of taking Unicode codepoints is
		// guaranteed to only accept ASCII digits, never a U+002D (MINUS SIGN).
		if (octetNumber > 255) {
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

export function parseSocketAddrV4(s: string): ParseResult<SocketAddrV4> {
	const [addr, afterAddr] = parseIpv4Addr(s)
	if (addr === null) {
		return [null, afterAddr]
	}

	if (s[afterAddr] !== ':') {
		return [null, afterAddr]
	}

	const [portStr, afterPort] = takeAsciiDigits(s, afterAddr + 1, 1, 5)
	const portNum = Number.parseInt(portStr, 10)
	return [SocketAddrV4.tryNew(addr, portNum), afterPort]
}
