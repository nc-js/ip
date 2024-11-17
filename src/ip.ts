import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './mod.ts'

/**
 * A representation of an IP address
 */
export interface IpAddrValue {
	/** Checks if this address equals another IP address */
	equals(other: this): boolean
	/**
	 * Checks if this address is a benchmarking address.
	 */
	isBenchmarking(): boolean
	/**
	 * Checks if this address is a documentation address.
	 */
	isDocumentation(): boolean
	/**
	 * Checks if this address is a loopback address.
	 */
	isLoopback(): boolean
	/**
	 * Checks if this address is a multicast address.
	 */
	isMulticast(): boolean
	/**
	 * Checks if this address is an unspecified address.
	 */
	isUnspecified(): boolean
}

/**
 * The concrete representation of an IP address,
 * which can be either an IPv4 or IPv6 address.
 */
export class IpAddr implements IpAddrValue {
	/** The IP address */
	public addr: IpAddrValue

	/**
	 * Creates a new IP address
	 */
	public constructor(addr: IpAddrValue) {
		this.addr = addr
	}

	/**
	 * Returns true if this is an IPv4 address, or false otherwise
	 */
	isIpv4(): this is Ipv6Addr {
		return this.addr instanceof Ipv4Addr
	}

	/**
	 * Returns true if this is an IPv6 address, or false otherwise
	 */
	isIpv6(): this is Ipv4Addr {
		return this.addr instanceof Ipv6Addr
	}

	/**
	 * Checks if this address equals another IP address
	 */
	equals(other: IpAddr): boolean {
		return this.addr.equals(other)
	}

	/**
	 * Checks if this address is a benchmarking address.
	 */
	isBenchmarking(): boolean {
		return this.addr.isBenchmarking()
	}

	/**
	 * Checks if this address is a documentation address.
	 */
	isDocumentation(): boolean {
		return this.addr.isDocumentation()
	}

	/**
	 * Checks if this address is a loopback address.
	 */
	isLoopback(): boolean {
		return this.addr.isLoopback()
	}

	/**
	 * Checks if this address is a multicast address.
	 */
	isMulticast(): boolean {
		return this.addr.isMulticast()
	}

	/**
	 * Checks if this address is an unspecified address.
	 */
	isUnspecified(): boolean {
		return this.addr.isUnspecified()
	}
}
