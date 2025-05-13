import { Ipv4Addr } from './ipv4.ts'

/**
 * An iterator over IPv4 addresses.
 *
 * @example Usage
 * ```ts
 * import { Ipv4Addr, Ipv4AddrIterator } from '@nc/ip/v4'
 *
 * const iter = new Ipv4AddrIterator(
 *     Ipv4Addr.tryNew(0, 0, 0, 250) as Ipv4Addr,
 *     Ipv4Addr.tryNew(0, 0, 1, 0) as Ipv4Addr
 * )
 *
 * for(const addr of iter) {
 *     console.log(addr.toString())
 * }
 * ```
 */
export class Ipv4AddrIterator implements IterableIterator<Ipv4Addr> {
	private currU32: number
	private endU32: number

	/** Create a new iterator from 2 IPv4 addresses */
	public constructor(start: Ipv4Addr, end: Ipv4Addr) {
		this.currU32 = start.toUint32()
		this.endU32 = end.toUint32()
	}

	/** Attempts to get the next IPv4 address */
	public next(): IteratorResult<Ipv4Addr> {
		if (this.currU32 < this.endU32) {
			return {
				value: Ipv4Addr.tryFromUint32(this.currU32++) as Ipv4Addr,
				done: false,
			}
		} else {
			return { value: null, done: true }
		}
	}

	/** The IPv4 address iterator itself */
	[Symbol.iterator](): Ipv4AddrIterator {
		return this
	}
}
