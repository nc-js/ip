import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './ipv6.ts'

/**
 * An interface for an IP address.
 */
export interface IpAddrValue {
	/**
	 * The array of unsigned 8-bit integers that make up this address.
	 *
	 * See [`Ipv4Addr.octets()`][v4]
	 * and [`Ipv6Addr.octets()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.octets
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.octets
	*/
	octets(): Uint8Array
	/**
	 * Checks if this address equals another IP address.
	 *
	 * See [`Ipv4Addr.equals()`][v4]
	 * and [`Ipv6Addr.equals()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.equals
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.equals
	*/
	equals(other: this): boolean
	/**
	 * Checks if this address is a benchmarking address.
	 *
	 * See [`Ipv4Addr.isBenchmarking()`][v4]
	 * and [`Ipv6Addr.isBenchmarking()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isBenchmarking
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isBenchmarking
	*/
	isBenchmarking(): boolean
	/**
	 * Checks if this address is a documentation address.
	 *
	 * See [`Ipv4Addr.isDocumentation()`][v4]
	 * and [`Ipv6Addr.isDocumentation()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isDocumentation
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isDocumentation
	*/
	isDocumentation(): boolean
	/**
	 * Checks if this address is a loopback address.
	 *
	 * See [`Ipv4Addr.isLoopback()`][v4]
	 * and [`Ipv6Addr.isLoopback()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isLoopback
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isLoopback
	 */
	isLoopback(): boolean
	/**
	 * Checks if this address is a multicast address.
	 *
	 * See [`Ipv4Addr.isMulticast()`][v4]
	 * and [`Ipv4Addr.isMulticast()`][v6]
	 * for more information.
	 * 
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isMulticast
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isMulticast
	 */
	isMulticast(): boolean
	/**
	 * Checks if this address is an unspecified address.
	 *
	 * See [`Ipv4Addr.isUnspecified()`][v4]
	 * and [`Ipv6Addr.isUnspecified()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isUnspecified
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isUnspecified
	 */
	isUnspecified(): boolean
}

/**
 * An IP address, either IPv4 address or IPv6 address.
 */
export class IpAddr implements IpAddrValue {
	/** The IP address */
	public addr: IpAddrValue

	/**
	 * Creates a new IP address.
	 */
	public constructor(addr: IpAddrValue) {
		this.addr = addr
	}

	/**
	 * Returns true if this is an IPv4 address ({@linkcode Ipv4Addr}),
	 * or false otherwise.
	 */
	isIpv4(): this is Ipv6Addr {
		return this.addr instanceof Ipv4Addr
	}

	/**
	 * Returns true if this is an IPv6 address ({@linkcode Ipv6Addr}),
	 * or false otherwise.
	 */
	isIpv6(): this is Ipv4Addr {
		return this.addr instanceof Ipv6Addr
	}

	/**
	 * The array of unsigned 8-bit integers that make up this address.
	 *
	 * See [`Ipv4Addr.octets()`][v4]
	 * and [`Ipv6Addr.octets()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.octets
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.octets
	*/
	octets(): Uint8Array {
		return this.addr.octets()
	}

	/**
	 * Checks if this address equals another IP address.
	 *
	 * See [`Ipv4Addr.equals()`][v4]
	 * and [`Ipv6Addr.equals()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.equals
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.equals
	*/
	equals(other: IpAddr): boolean {
		return this.addr.equals(other)
	}

	/**
	 * Checks if this address is a benchmarking address.
	 *
	 * See [`Ipv4Addr.isBenchmarking()`][v4]
	 * and [`Ipv6Addr.isBenchmarking()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isBenchmarking
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isBenchmarking
	*/
	isBenchmarking(): boolean {
		return this.addr.isBenchmarking()
	}

	/**
	 * Checks if this address is a documentation address.
	 *
	 * See [`Ipv4Addr.isDocumentation()`][v4]
	 * and [`Ipv6Addr.isDocumentation()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isDocumentation
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isDocumentation
	*/
	isDocumentation(): boolean {
		return this.addr.isDocumentation()
	}

	/**
	 * Checks if this address is a loopback address.
	 *
	 * See [`Ipv4Addr.isLoopback()`][v4]
	 * and [`Ipv6Addr.isLoopback()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isLoopback
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isLoopback
	 */
	isLoopback(): boolean {
		return this.addr.isLoopback()
	}

	/**
	 * Checks if this address is a multicast address.
	 *
	 * See [`Ipv4Addr.isMulticast()`][v4]
	 * and [`Ipv6Addr.isMulticast()`][v6]
	 * for more information.
	 * 
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isMulticast
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isMulticast
	 */
	isMulticast(): boolean {
		return this.addr.isMulticast()
	}

	/**
	 * Checks if this address is an unspecified address.
	 *
	 * See [`Ipv4Addr.isUnspecified()`][v4]
	 * and [`Ipv6Addr.isUnspecified()`][v6]
	 * for more information.
	 *
	 * [v4]: https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr.prototype.isUnspecified
	 * [v6]: https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr.prototype.isUnspecified
	 */
	isUnspecified(): boolean {
		return this.addr.isUnspecified()
	}
}
