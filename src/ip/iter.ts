import { Ipv4Addr, Ipv6Addr } from '../mod.ts'

/**
 * An iterator over IPv4 addresses.
 *
 * @example Usage
 * ```ts
 * import { Ipv4Addr, Ipv4AddrIterator } from '@nc/net-addr/ip'
 *
 * const iter = new Ipv4AddrIterator(
 *     Ipv4Addr.tryNew(0, 0, 0, 250) as Ipv4Addr,
 *     Ipv4Addr.tryNew(0, 0, 1, 0) as Ipv4Addr
 * )
 *
 * for(const addr of iter) {
 *     console.log(addr)
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

/**
 * An iterator over IPv6 addresses.
 *
 * @example Usage
 * ```ts
 * import { Ipv6Addr, Ipv6AddrIterator } from '@nc/net-addr/ip'
 *
 * const iter = new Ipv6AddrIterator(
 *     Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 65530) as Ipv6Addr,
 *     Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 1, 0) as Ipv6Addr
 * )
 *
 * for(const addr of iter) {
 *     console.log(addr)
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
