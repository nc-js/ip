import type { IpAddrValue } from './ip.ts'
import { arrayStartsWith, clampUint16 } from './utils.ts'

/**
 * A representation of an IPv6 address
 */
export class Ipv6Addr implements IpAddrValue {
	/**
	 * A localhost address at `::1`, or `0:0:0:0:0:0:0:1`
	 */
	// deno-fmt-ignore
	public static LOCALHOST: Ipv6Addr = new Ipv6Addr(
		new Uint16Array([0, 0, 0, 0, 0, 0, 0, 1])
	)

	/**
	 * An unspecified address at `::`, or `0:0:0:0:0:0:0:0`
	 */
	// deno-fmt-ignore
	public static UNSPECIFIED: Ipv6Addr = new Ipv6Addr(
		new Uint16Array([0, 0, 0, 0, 0, 0, 0, 0])
	)

	/** A fixed-size array of 8 unsigned 16-bit segments */
	public segments: Uint16Array

	private constructor(segments: Uint16Array) {
		this.segments = segments
	}

	/**
	 * The first segment of the IPv6 address in network byte order,
	 * from bits 0-15.
	 */
	get a(): number {
		return this.segments[0]
	}

	/**
	 * The second segment of the IPv6 address in network byte order,
	 * from bits 16-31.
	 */
	get b(): number {
		return this.segments[1]
	}

	/**
	 * The third segment of the IPv6 address in network byte order,
	 * from bits 32-47.
	 */
	get c(): number {
		return this.segments[2]
	}

	/**
	 * The fourth segment of the IPv6 address in network byte order,
	 * from bits 48-63.
	 */
	get d(): number {
		return this.segments[3]
	}

	/**
	 * The fifth segment of the IPv6 address in network byte order,
	 * from bits 64-79.
	 */
	get e(): number {
		return this.segments[4]
	}

	/**
	 * The sixth segment of the IPv6 address in network byte order,
	 * from bits 80-95.
	 */
	get f(): number {
		return this.segments[5]
	}

	/**
	 * The seventh segment of the IPv6 address in network byte order,
	 * from bits 96-111.
	 */
	get g(): number {
		return this.segments[6]
	}

	/**
	 * The eighth segment of the IPv6 address in network byte order,
	 * from bits 112-127.
	 */
	get h(): number {
		return this.segments[7]
	}

	/**
	 * Creates a new IPv6 address from 8 integers, where each integer
	 * is implicitly clamped to the range of an unsigned 16-bit integer
	 * (0 to 65535).
	 */
	public static newAddr(
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number,
		g: number,
		h: number,
	): Ipv6Addr {
		return new Ipv6Addr(
			new Uint16Array([
				clampUint16(a),
				clampUint16(b),
				clampUint16(c),
				clampUint16(d),
				clampUint16(e),
				clampUint16(f),
				clampUint16(g),
				clampUint16(h),
			]),
		)
	}

	/**
	 * Attempts to create an `Ipv6Addr` from an array of numbers.
	 *
	 * This returns `undefined` if the array length is not equal to 8,
	 * otherwise returns an `Ipv6Addr`.
	 */
	public static tryFromArray(array: number[]): Ipv6Addr | undefined {
		if (array.length !== 8) {
			return undefined
		}

		return Ipv6Addr.newAddr(
			array[0],
			array[1],
			array[2],
			array[3],
			array[4],
			array[5],
			array[6],
			array[7],
		)
	}

	/**
	 * Attempts to create an `Ipv6Addr` from a `Uint16Array`.
	 *
	 * This returns `undefined` if the array length is not equal to 8,
	 * otherwise returns an `Ipv6Addr`.
	 */
	public static tryFromUint16Array(array: Uint16Array): Ipv6Addr | undefined {
		return (array.length === 8) ? new Ipv6Addr(array) : undefined
	}

	/**
	 * Attempts to create an `Ipv6Addr` from a `DataView`.
	 *
	 * This returns `undefined` if the view is not 16 bytes long,
	 * otherwise returns an `Ipv6Addr`.
	 */
	public static tryFromDataView(view: DataView): Ipv6Addr | undefined {
		if (view.byteLength !== 16) {
			return undefined
		}

		return new Ipv6Addr(
			new Uint16Array([
				view.getUint16(0),
				view.getUint16(1),
				view.getUint16(2),
				view.getUint16(3),
				view.getUint16(4),
				view.getUint16(5),
				view.getUint16(6),
				view.getUint16(7),
			]),
		)
	}

	/**
	 * This returns an IPv6 address as a fully uncompressed string,
	 * as `aaaa:bbbb:cccc:dddd:eeee:ffff:gggg:hhhh`.
	 */
	public toString(): string {
		const hextets = []
		for (const segment of this.segments) {
			hextets.push(segment.toString(16).padStart(4, '0'))
		}
		return hextets.join(':')
	}

	/**
	 * Checks if this IPv6 address is equal to another IPv6 address.
	 */
	public equals(other: Ipv6Addr): boolean {
		return this.a === other.a &&
			this.b === other.b &&
			this.c === other.c &&
			this.d === other.d &&
			this.e === other.e &&
			this.f === other.f &&
			this.g === other.g &&
			this.h === other.h
	}

	/**
	 * Checks if this IPv6 address is a benchmarking address.
	 *
	 * This range is defined in [IETF RFC Errata 1752][errata1572]
	 * as `2000:0002::/48`.
	 *
	 * [errata1572]: https://www.rfc-editor.org/errata/eid1752
	 */
	public isBenchmarking(): boolean {
		return this.a === 0x2001 &&
			this.b === 0x2 &&
			this.c === 0
	}

	/**
	 * Checks if this IPv6 address is a documentation address.
	 *
	 * This range is defined in [IETF RFC 3849][rfc3849]
	 * as `2000:db8::/32`.
	 */
	public isDocumentation(): boolean {
		return this.a === 0x2001 && this.b === 0xdb8
	}

	/**
	 * Checks if this IPv6 address is a global address as specified
	 * by the [IANA IPv6 Special-Purpose Address Registry][registry].
	 *
	 * [registry]: https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml
	 */
	// deno-fmt-ignore
	public isGlobal(): boolean {
		const ipv4Mapped = new Uint16Array([0, 0, 0, 0, 0, 0xffff])
		const ipv4Translated = new Uint16Array([0x64, 0xff9b, 1])
		const discardOnly = new Uint16Array([0x100, 0, 0, 0])

		return !(this.isUnspecified()
			|| this.isLoopback()
			|| arrayStartsWith(this.segments, ipv4Mapped)
			|| arrayStartsWith(this.segments, ipv4Translated)
			|| arrayStartsWith(this.segments, discardOnly)
			|| (
				(this.a === 0x2001 && this.b < 0x200) && !(
					uint128FromHextets(this.segments) === BigInt("0x20010001000000000000000000000001")
					|| uint128FromHextets(this.segments) === BigInt("0x20010001000000000000000000000002")
					|| arrayStartsWith(this.segments, new Uint16Array([0x2001, 0x3]))
					|| arrayStartsWith(this.segments, new Uint16Array([0x2001, 4, 0x112]))
					|| (this.a === 0x2001 && (this.b >= 0x10 && this.b <= 0x3f))
				)
			)
			|| this.a === 0x2002
			|| this.isDocumentation()
			|| this.isUniqueLocal()
			|| this.isUnicastLinkLocal())
	}

	/**
	 * Checks if this IPv6 address is an IPv4-mapped address,
	 * aka `::ffff:0:0/96`.
	 */
	public isIpv4Mapped(): boolean {
		return arrayStartsWith(
			this.segments,
			new Uint16Array([0, 0, 0, 0, 0, 0xffff]),
		)
	}

	/**
	 * Checks if this IPv6 address is a loopback address.
	 *
	 * This is defined in [IETF RFC 4291 § 2.5.3][rfc4921] as `::1`.
	 *
	 * [rfc4291]: https://datatracker.ietf.org/doc/html/rfc4291
	 */
	public isLoopback(): boolean {
		return this.equals(Ipv6Addr.LOCALHOST)
	}

	/**
	 * Checks if this IPv6 address is a multicast address.
	 *
	 * This is defined in [IETF RFC 4291][rfc4921] as `ff00::/8`.
	 *
	 * [rfc4921]: https://datatracker.ietf.org/doc/html/rfc4291
	 */
	public isMulticast(): boolean {
		return (this.a & 0xff00) === 0xff00
	}

	/**
	 * Checks if this IPv6 address is a unique local address.
	 *
	 * This is defined in [IETF RFC 4193][rfc4193] as any address
	 * that is not a multicast address.
	 *
	 * [rfc4193]: https://datatracker.ietf.org/doc/html/rfc4193
	 */
	public isUnicast(): boolean {
		return !this.isMulticast()
	}

	/**
	 * Checks if this IPv6 address is a globally routable unicast address.
	 *
	 * This checks if:
	 * - The address is a unicast address
	 * - The address is not a loopback address
	 * - The address is not a link-local address
	 * - The address is not a unique local address
	 * - The address is not an unspecified address
	 * - The address is not a documentation address
	 * - The address is not a benchmarking address
	 */
	public isUnicastGlobal(): boolean {
		return this.isUnicast() &&
			!this.isLoopback() &&
			!this.isUnicastLinkLocal() &&
			!this.isUniqueLocal() &&
			!this.isUnspecified() &&
			!this.isDocumentation() &&
			!this.isBenchmarking()
	}

	/**
	 * Checks if this IPv6 address is a link-local unicast address.
	 *
	 * This is defined in [IETF RFC 4291 § 2.5.6][rfc4921] as `fe80::/10`.
	 *
	 * [rfc4921]: https://datatracker.ietf.org/doc/html/rfc4291
	 */
	public isUnicastLinkLocal(): boolean {
		return (this.a & 0xffc0) === 0xfe80
	}

	/**
	 * Checks if this IPv6 address is a unique local address.
	 *
	 * This is defined in [IETF RFC 4193][rfc4193] as `fc00::/7`.
	 *
	 * [rfc4193]: https://datatracker.ietf.org/doc/html/rfc4193
	 */
	public isUniqueLocal(): boolean {
		return (this.a & 0xfe00) === 0xfc00
	}

	/**
	 * Checks if this IPv6 address is an unspecified address.
	 *
	 * This is defined in [IETF RFC 4291 § 2.5.2][rfc4921] as `::`.
	 *
	 * [rfc4921]: https://datatracker.ietf.org/doc/html/rfc4291
	 */
	public isUnspecified(): boolean {
		return this.equals(Ipv6Addr.UNSPECIFIED)
	}

	/**
	 * Checks if this IPv6 address is a multicast address,
	 * and if so returns the multicast scope (the range of addresses
	 * for multicasting traffic).
	 *
	 * Multicast scopes are defined in [IETF RFC 7346 § 2][rfc7346].
	 *
	 * [rfc7346]: https://datatracker.ietf.org/doc/html/rfc7346#section-2
	 */
	public multicastScope(): MulticastScope | undefined {
		if (!this.isMulticast()) {
			return undefined
		}

		switch (this.a & 0x000f) {
			case 1:
				return 'InterfaceLocal'
			case 2:
				return 'LinkLocal'
			case 3:
				return 'RealmLocal'
			case 4:
				return 'AdminLocal'
			case 5:
				return 'SiteLocal'
			case 8:
				return 'OrganizationLocal'
			case 14:
				return 'Global'
			default:
				return undefined
		}
	}
}

/**
 * Different ranges of addresses for multicasting traffic.
 *
 * These are defined in [IETF RFC 7346 § 2][rfc7346].
 *
 * [rfc7346]: https://datatracker.ietf.org/doc/html/rfc7346#section-2
 */
export type MulticastScope =
	| 'InterfaceLocal'
	| 'LinkLocal'
	| 'RealmLocal'
	| 'AdminLocal'
	| 'SiteLocal'
	| 'OrganizationLocal'
	| 'Global'

function uint128FromHextets(array: Uint16Array): bigint {
	let result = BigInt(0)
	for (let i = 0; i < array.length; i++) {
		result = (result << BigInt(16)) | BigInt(array[i])
	}
	return result
}
