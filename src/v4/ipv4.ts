import { isUint32, isUint8 } from '@nc/whatwg-infra/num'
import type { IpAddrValue } from '../ip.ts'
import { Ipv6Addr } from '../mod.ts'
import { parseIpv4Addr } from '../utils/parser.ts'
import { arrayStartsWith } from '../utils/utils.ts'

/**
 * An IPv4 address.
 *
 * @example Creating an address
 * ```ts
 * import { assertEquals } from '@std/assert'
 * import { Ipv4Addr } from '@nc/ip/v4'
 *
 * const ip0 = Ipv4Addr.LOCALHOST
 * const ip1 = Ipv4Addr.parse('127.0.0.1')
 * const ip2 = Ipv4Addr.tryNew(127, 0, 0, 1)
 * const ip3 = Ipv4Addr.tryFromArray([127, 0, 0, 1])
 * const ip4 = Ipv4Addr.tryFromUint32(2_130_706_433)
 * const ip5 = Ipv4Addr.tryFromUint8Array(new Uint8Array([127, 0, 0, 1]))
 *
 * assertEquals(ip0, ip1)
 * assertEquals(ip0, ip2)
 * assertEquals(ip0, ip3)
 * assertEquals(ip0, ip4)
 * assertEquals(ip0, ip5)
 * ```
 *
 * @example Properties of an address
 * ```ts
 * import { assert, assertEquals } from '@std/assert'
 * import { Ipv4Addr } from '@nc/ip/addr'
 *
 * const localhost = Ipv4Addr.LOCALHOST
 *
 * assertEquals(localhost.toString(), '127.0.0.1')
 * assertEquals(localhost.octets(), new Uint8Array([127, 0, 0, 1]))
 * assert(localhost.isLoopback())
 * assert(Ipv4Addr.tryNew(0, 0, 0, 0)?.isUnspecified())
 * assert(Ipv4Addr.tryNew(10, 0, 0, 0)?.isPrivate())
 * ```
 */
export class Ipv4Addr implements IpAddrValue {
	/** An IPv4 address at `255.255.255.255` */
	public static BROADCAST: Ipv4Addr = new Ipv4Addr(
		new Uint8Array([255, 255, 255, 255]),
	)

	/** An IPv4 address at `127.0.0.1` */
	public static LOCALHOST: Ipv4Addr = new Ipv4Addr(
		new Uint8Array([127, 0, 0, 1]),
	)

	/** An IPv4 address at `0.0.0.0` */
	public static UNSPECIFIED: Ipv4Addr = new Ipv4Addr(
		new Uint8Array([0, 0, 0, 0]),
	)

	/** A fixed-size array of 4 unsigned 8-bit integers */
	private _octets: Uint8Array

	private constructor(octets: Uint8Array) {
		this._octets = octets
	}

	/** The 1st octet of the IPv4 address in network byte order (bits 0-7) */
	public get a(): number {
		return this._octets[0]
	}

	/** The 2nd octet of the IPv4 address in network byte order (bits 8-15) */
	public get b(): number {
		return this._octets[1]
	}

	/** The 3rd octet of the IPv4 address in network byte order (bits 16-23) */
	public get c(): number {
		return this._octets[2]
	}

	/** The 4th octet of the IPv4 address in network byte order (bits 24-31) */
	public get d(): number {
		return this._octets[3]
	}

	/**
	 * Creates an IP address from 4 numbers.
	 *
	 * This returns `null` if any given number is not an unsigned 8-bit integer.
	 */
	public static tryNew(
		a: number,
		b: number,
		c: number,
		d: number,
	): Ipv4Addr | null {
		if (
			!isUint8(a) ||
			!isUint8(b) ||
			!isUint8(c) ||
			!isUint8(d)
		) {
			return null
		}

		return new Ipv4Addr(
			new Uint8Array([
				a,
				b,
				c,
				d,
			]),
		)
	}

	/**
	 * Attempts to create an IPv4 address from an unsigned 32-bit integer.
	 *
	 * This returns `null` if the given number is not a valid unsigned
	 * 32-bit integer (0 to 4,294,967,295).
	 */
	public static tryFromUint32(uint32: number): Ipv4Addr | null {
		if (!isUint32(uint32)) {
			return null
		}

		return new Ipv4Addr(
			new Uint8Array([
				(uint32 >>> 24) & 255,
				(uint32 >>> 16) & 255,
				(uint32 >>> 8) & 255,
				uint32 & 255,
			]),
		)
	}

	/**
	 * Parses an IP address string in dot-decimal notation,
	 * e.g `127.0.0.1`.
	 *
	 * The string must have 4 octets (a number in the range of an unsigned
	 * 8-bit integer, 0 to 255), each separated by a dot.
	 *
	 * This returns `null` if the string does not conform to the format.
	 */
	public static parse(s: string): Ipv4Addr | null {
		const [result, afterResult] = parseIpv4Addr(s)
		if (s[afterResult] === '.') {
			return null
		}

		return result
	}

	/**
	 * Attempts to create an `Ipv4Addr` from an array of numbers.
	 *
	 * This returns `null` if:
	 *  - the array length is not equal to 4,
	 *  - any of the numbers are not a valid unsigned 8-bit integer
	 */
	public static tryFromArray(array: number[]): Ipv4Addr | null {
		if (array.length !== 4) {
			return null
		}

		return Ipv4Addr.tryNew(
			array[0],
			array[1],
			array[2],
			array[3],
		)
	}

	/**
	 * Attempts to create an `Ipv4Addr` from a `Uint8Array`.
	 *
	 * This returns `null` if the array length is not equal to 4.
	 */
	public static tryFromUint8Array(
		array: Uint8Array,
	): Ipv4Addr | null {
		return (array.length === 4) ? new Ipv4Addr(array) : null
	}

	/**
	 * Attempts to create an `Ipv4Addr` from a `Uint8ClampedArray`.
	 *
	 * This returns `null` if the array length is not equal to 4.
	 */
	public static tryFromUint8ClampedArray(
		array: Uint8ClampedArray,
	): Ipv4Addr | null {
		if (array.length !== 4) {
			return null
		}

		return new Ipv4Addr(
			new Uint8Array([
				array[0],
				array[1],
				array[2],
				array[3],
			]),
		)
	}

	/**
	 * Attempts to create an `Ipv4Addr` from a `DataView`.
	 *
	 * This returns `null` if the view is not 4 bytes long.
	 */
	public static tryFromDataView(view: DataView): Ipv4Addr | null {
		if (view.byteLength !== 4) {
			return null
		}

		return new Ipv4Addr(
			new Uint8Array([
				view.getUint8(0),
				view.getUint8(1),
				view.getUint8(2),
				view.getUint8(3),
			]),
		)
	}

	/**
	 * Returns the IPv4 address as an unsigned 32-bit integer.
	 */
	public toUint32(): number {
		return uint8ArrayToUint32(this._octets)
	}

	/**
	 * Returns the IPv4 address in dot decimal notation.
	 */
	public toString(): string {
		return `${this.a}.${this.b}.${this.c}.${this.d}`
	}

	/**
	 * Returns the IPv4 address that occurs before this address.
	 *
	 * This returns `null` if the current address is `0.0.0.0`.
	 */
	public previous(): Ipv4Addr | null {
		return Ipv4Addr.tryFromUint32(this.toUint32() - 1)
	}

	/**
	 * Returns the IPv4 address that occurs after this address.
	 *
	 * This returns `null` if the current address is `255.255.255.255`.
	 *
	 * To iterate over multiple IPv4 addresses in a way
	 * that is more optimized, use {@linkcode Ipv4AddrIterator}.
	 */
	public next(): Ipv4Addr | null {
		return Ipv4Addr.tryFromUint32(this.toUint32() + 1)
	}

	/**
	 * A fixed-size array of 4 unsigned 8-bit integers.
	 */
	public octets(): Uint8Array {
		return this._octets
	}

	/**
	 * Checks if this IPv4 address equals another IPv4 address.
	 */
	public equals(other: Ipv4Addr): boolean {
		return this.a === other.a &&
			this.b === other.b &&
			this.c === other.c &&
			this.d === other.d
	}

	/**
	 * Checks if this IPv4 address is a benchmarking address.
	 *
	 * This range is defined in [IETF RFC 2544][rfc2544]
	 * as `198.18.0.0/15`.
	 *
	 * [rfc2544]: https://datatracker.ietf.org/doc/html/rfc2544
	 */
	public isBenchmarking(): boolean {
		return this.a === 198 && (this.b & 0xfe) === 18
	}

	/**
	 * Checks if this IPv4 address is a broadcast address.
	 *
	 * This is defined in [IETF RFC 919][rfc919] as
	 * `255.255.255.255`.
	 *
	 * [rfc919]: https://datatracker.ietf.org/doc/html/rfc919
	 */
	public isBroadcast(): boolean {
		return this.equals(Ipv4Addr.BROADCAST)
	}

	/**
	 * Checks if this IPv4 address is a documentation address.
	 *
	 * This range is defined in [IETF RFC 5737][rfc5737]
	 * as:
	 * - `192.0.2.0/24` (TEST-NET-1)
	 * - `198.51.100.0/24` (TEST-NET-2)
	 * - `203.0.113.0/24` (TEST-NET-3)
	 *
	 * [rfc5737]: https://datatracker.ietf.org/doc/html/rfc5737
	 */
	public isDocumentation(): boolean {
		return arrayStartsWith(this._octets, new Uint8Array([192, 0, 2])) ||
			arrayStartsWith(this._octets, new Uint8Array([198, 51, 100])) ||
			arrayStartsWith(this._octets, new Uint8Array([203, 0, 113]))
	}

	/**
	 * Checks if this IPv4 address is a global address as specified
	 * by the [IANA IPv4 Special-Purpose Address Registry][registry].
	 *
	 * [registry]: https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml
	 */
	// deno-fmt ignore
	public isGlobal(): boolean {
		return !(this.a === 0 ||
			this.isPrivate() ||
			this.isShared() ||
			this.isLoopback() ||
			this.isLinkLocal() ||
			(
				this.a === 192 && this.b === 0 && this.c === 0 &&
				this.d !== 9 && this.d !== 10
			) ||
			this.isDocumentation() ||
			this.isBenchmarking() ||
			this.isReserved() ||
			this.isBroadcast())
	}

	/**
	 * Checks if this IPv4 address is a link-local address.
	 *
	 * This range is defined in [IETF RFC 3927][rfc3927]
	 * as `169.254.0.0/16`.
	 *
	 * [rfc3927]: https://datatracker.ietf.org/doc/html/rfc3927
	 */
	public isLinkLocal(): boolean {
		return arrayStartsWith(this._octets, new Uint8Array([169, 254]))
	}

	/**
	 * Checks if this IPv4 address is a loopback address.
	 *
	 * This range is defined in [IETF RFC 1112][rfc1112]
	 * as `127.0.0.0/8`.
	 *
	 * [rfc1112]: https://datatracker.ietf.org/doc/html/rfc1112
	 */
	public isLoopback(): boolean {
		return this.a === 127
	}

	/**
	 * Checks if this IPv4 address is a multicast address.
	 *
	 * This range is defined in [IETF RFC 5771][rfc5771]
	 * as `224.0.0.0/4`.
	 *
	 * [rfc5771]: https://datatracker.ietf.org/doc/html/rfc5771
	 */
	public isMulticast(): boolean {
		return this.a >= 224 && this.a <= 239
	}

	/**
	 * Checks if this IPv4 address is a private address.
	 *
	 * The ranges are defined in [IETF RFC 1918][rfc1918] as:
	 * - `10.0.0.0/8`
	 * - `172.16.0.0/12`
	 * - `192.168.0.0/16`
	 *
	 * [rfc1918]: https://datatracker.ietf.org/doc/html/rfc1918
	 */
	public isPrivate(): boolean {
		return (this.a === 10) ||
			(this.a === 172 && (this.b >= 16 && this.b <= 31)) ||
			(this.a === 192 && this.b === 168)
	}

	/**
	 * Checks if this IPv4 address is a private address.
	 *
	 * This implementation follows Rust's implementation of
	 * [`Ipv4Addr::is_reserved()`][reserved], see that link
	 * for further information.
	 *
	 * [reserved]: https://doc.rust-lang.org/stable/std/net/struct.Ipv4Addr.html#method.is_reserved
	 */
	public isReserved(): boolean {
		return ((this.a & 240) === 240) && !this.isBroadcast()
	}

	/**
	 * Checks if this IPv4 address is part of the Shared Address Space.
	 *
	 * This range is defined in [IETF RFC 6598][rfc6598]
	 * as `100.64.0.0/10`.
	 *
	 * [rfc6598]: https://datatracker.ietf.org/doc/html/rfc6598
	 */
	public isShared(): boolean {
		return this.a === 100 && ((this.b & 0b1100_0000) === 0b0100_0000)
	}

	/**
	 * Checks if this IPv4 address is an unspecified address.
	 *
	 * This address is defined in *UNIX Network Programming, Second Edition*,
	 * W. Richard Stevens, p. 891; see also [ip7].
	 *
	 * [ip7]: https://man7.org/linux/man-pages/man7/ip.7.html
	 */
	public isUnspecified(): boolean {
		return this.equals(Ipv4Addr.UNSPECIFIED)
	}

	/**
	 * Converts this address to an IPv4-compatible IPv6 address.
	 *
	 * `a.b.c.d` becomes `::a.b.c.d`.
	 *
	 * Note that IPv4-compatible addresses have been officially deprecated.
	 * If you don't explicitly need an IPv4-compatible address for legacy reasons,
	 * consider using {@linkcode toIpv6Mapped} instead.
	 */
	public toIpv6Compatible(): Ipv6Addr {
		const [a, b, c, d] = this.octets()
		return Ipv6Addr.tryFromUint8Array(
			new Uint8Array(
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, a, b, c, d],
			),
		) as Ipv6Addr
	}

	/**
	 * Converts this address to an IPv4-mapped Ipv6 address.
	 *
	 * `a.b.c.d` becomes `::ffff:a.b.c.d`.
	 */
	public toIpv6Mapped(): Ipv6Addr {
		const [a, b, c, d] = this.octets()
		return Ipv6Addr.tryFromUint8Array(
			new Uint8Array(
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF, 0xFF, a, b, c, d],
			),
		) as Ipv6Addr
	}
}

function uint8ArrayToUint32(array: ArrayLike<number>) {
	return (
		(array[0] << 24) |
		(array[1] << 16) |
		(array[2] << 8) |
		array[3]
	) >>> 0
}
