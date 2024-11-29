import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './ipv6.ts'

/**
 * An interface for an IP address.
 */
export interface IpAddrValue {
	/**
	 * The array of unsigned 8-bit integers that make up this address.
	 *
	 * See {@linkcode Ipv4Addr.octets | Ipv4Addr.octets()}
	 * and {@linkcode Ipv6Addr.octets | Ipv6Addr.octets()}
	 * for more information.
	 */
	octets(): Uint8Array
	/**
	 * Checks if this address equals another IP address.
	 *
	 * See {@linkcode Ipv4Addr.equals | Ipv4Addr.equals()}
	 * and {@linkcode Ipv6Addr.equals | Ipv6Addr.equals()}
	 * for more information.
	 */
	equals(other: this): boolean
	/**
	 * Checks if this address is a benchmarking address.
	 *
	 * See {@linkcode Ipv4Addr.isBenchmarking | Ipv4Addr.isBenchmarking()}
	 * and {@linkcode Ipv6Addr.isBenchmarking | Ipv6Addr.isBenchmarking()}
	 * for more information.
	 */
	isBenchmarking(): boolean
	/**
	 * Checks if this address is a documentation address.
	 *
	 * See {@linkcode Ipv4Addr.isDocumentation | Ipv4Addr.isDocumentation()}
	 * and {@linkcode Ipv6Addr.isDocumentation | Ipv6Addr.isDocumentation()}
	 * for more information.
	 */
	isDocumentation(): boolean
	/**
	 * Checks if this address is a loopback address.
	 *
	 * See {@linkcode Ipv4Addr.isLoopback | Ipv4Addr.isLoopback()}
	 * and {@linkcode Ipv6Addr.isLoopback | Ipv6Addr.isLoopback()}
	 * for more information.
	 */
	isLoopback(): boolean
	/**
	 * Checks if this address is a multicast address.
	 *
	 * See {@linkcode Ipv4Addr.isMulticast | Ipv4Addr.isMulticast()}
	 * and {@linkcode Ipv6Addr.isMulticast | Ipv6Addr.isMulticast()}
	 * for more information.
	 */
	isMulticast(): boolean
	/**
	 * Checks if this address is an unspecified address.
	 *
	 * See {@linkcode Ipv4Addr.isUnspecified | Ipv4Addr.isUnspecified()}
	 * and {@linkcode Ipv6Addr.isUnspecified | Ipv6Addr.isUnspecified()}
	 * for more information.
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
	 * See {@linkcode Ipv4Addr.octets | Ipv4Addr.octets()}
	 * and {@linkcode Ipv6Addr.octets | Ipv6Addr.octets()}
	 * for more information.
	 */
	octets(): Uint8Array {
		return this.addr.octets()
	}

	/**
	 * Checks if this address equals another IP address.
	 *
	 * See {@linkcode Ipv4Addr.equals | Ipv4Addr.equals()}
	 * and {@linkcode Ipv6Addr.equals | Ipv6Addr.equals()}
	 * for more information.
	 */
	equals(other: IpAddr): boolean {
		return this.addr.equals(other)
	}

	/**
	 * Checks if this address is a benchmarking address.
	 *
	 * See {@linkcode Ipv4Addr.isBenchmarking | Ipv4Addr.isBenchmarking()}
	 * and {@linkcode Ipv6Addr.isBenchmarking | Ipv6Addr.isBenchmarking()}
	 * for more information.
	 */
	isBenchmarking(): boolean {
		return this.addr.isBenchmarking()
	}

	/**
	 * Checks if this address is a documentation address.
	 *
	 * See {@linkcode Ipv4Addr.isDocumentation | Ipv4Addr.isDocumentation()}
	 * and {@linkcode Ipv6Addr.isDocumentation | Ipv6Addr.isDocumentation()}
	 * for more information.
	 */
	isDocumentation(): boolean {
		return this.addr.isDocumentation()
	}

	/**
	 * Checks if this address is a loopback address.
	 *
	 * See {@linkcode Ipv4Addr.isLoopback | Ipv4Addr.isLoopback()}
	 * and {@linkcode Ipv6Addr.isLoopback | Ipv6Addr.isLoopback()}
	 * for more information.
	 */
	isLoopback(): boolean {
		return this.addr.isLoopback()
	}

	/**
	 * Checks if this address is a multicast address.
	 *
	 * See {@linkcode Ipv4Addr.isMulticast | Ipv4Addr.isMulticast()}
	 * and {@linkcode Ipv6Addr.isMulticast | Ipv6Addr.isMulticast()}
	 * for more information.
	 */
	isMulticast(): boolean {
		return this.addr.isMulticast()
	}

	/**
	 * Checks if this address is an unspecified address.
	 *
	 * See {@linkcode Ipv4Addr.isUnspecified | Ipv4Addr.isUnspecified()}
	 * and {@linkcode Ipv6Addr.isUnspecified | Ipv6Addr.isUnspecified()}
	 * for more information.
	 */
	isUnspecified(): boolean {
		return this.addr.isUnspecified()
	}
}
