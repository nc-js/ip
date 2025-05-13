import { Ipv6Addr } from './ipv6.ts'

/**
 * An iterator over IPv6 addresses.
 *
 * @example Usage
 * ```ts
 * import { Ipv6Addr, Ipv6AddrIterator } from '@nc/ip/v6'
 *
 * const iter = new Ipv6AddrIterator(
 *     Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65530) as Ipv6Addr,
 *     Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 1, 0) as Ipv6Addr
 * )
 *
 * for(const addr of iter) {
 *     console.log(addr.toString())
 * }
 * ```
 */
export class Ipv6AddrIterator implements IterableIterator<Ipv6Addr> {
	private currU128: bigint
	private endU128: bigint

	/** Create a new iterator from 2 IPv6 addresses */
	public constructor(start: Ipv6Addr, end: Ipv6Addr) {
		this.currU128 = start.toUint128()
		this.endU128 = end.toUint128()
	}

	/** Attempts to get the next IPv6 address */
	public next(): IteratorResult<Ipv6Addr> {
		if (this.currU128 < this.endU128) {
			return {
				value: Ipv6Addr.tryFromUint128(this.currU128++) as Ipv6Addr,
				done: false,
			}
		} else {
			return { value: null, done: true }
		}
	}

	/** The IPv6 address iterator itself */
	[Symbol.iterator](): Ipv6AddrIterator {
		return this
	}
}
