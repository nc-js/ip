import type { Ipv4Addr } from './ipv4.ts'
import type { Ipv6Addr } from './ipv6.ts'
import { parseSocketAddrV4 } from './parser.ts'
import { isValidUint16 } from './utils.ts'

/**
 * A socket address, containing an IPv4 address and a port number.
 */
export class SocketAddrV4 {
	/** The IPv4 address of the socket */
	public readonly addr: Ipv4Addr
	/** The unsigned 16-bit port number of the address */
	public readonly port: number

	/**
	 * Creates a new socket address from an IPv4 address and a port number.
	 *
	 * **NOTE**: It is the caller's responsibility to check that the port
	 * number passed is an integer (not `NaN`, `Infinity`, or  `-Infinity`)
	 * and is within the range of an unsigned 16-bit integer.
	 *
	 * @param addr The IPv4 address of the socket
	 * @param port The unsigned 16-bit port number of the address
	 */
	public constructor(addr: Ipv4Addr, port: number) {
		this.addr = addr
		this.port = port
	}

	/**
	 * Attempts to create a new `SocketAddrV4`.
	 *
	 * This returns `null` if the port is not a valid unsigned 16-bit integer.
	 */
	public static tryNew(addr: Ipv4Addr, port: number): SocketAddrV4 | null {
		if (!isValidUint16(port)) {
			return null
		}

		return new SocketAddrV4(addr, port)
	}

	/**
	 * Parses a string in the format of `"ipv4:port"`,
	 * where the port is an unsigned 16-bit integer.
	 *
	 * This returns `null` if:
	 * - The IPv4 address cannot be parsed.
	 * - The IPV4 address can be parsed, but there's no `:` delimiter.
	 * - The port number can't be parsed, or is out of bounds of an unsigned
	 *   16-bit integer (0 to 65,535).
	 */
	public static parse(s: string): SocketAddrV4 | null {
		const [socket, _] = parseSocketAddrV4(s)
		return socket
	}

	/**
	 * Returns the socket address as a string in the format of
	 * `<ipaddr4>:<port>`
	 */
	public toString(): string {
		return `${this.addr}:${this.port}`
	}
}

/**
 * A socket address, containing an IPv6 address and a port number.
 */
export class SocketAddrV6 {
	/** The IPv6 address of the socket */
	public readonly addr: Ipv6Addr
	/** The unsigned 16-bit port number of the address */
	public readonly port: number

	/**
	 * Creates a new socket address from an IPv6 address and a port number.
	 *
	 * **NOTE**: It is the caller's responsibility to check that the port
	 * number passed is an integer (not `NaN`, `Infinity`, or  `-Infinity`)
	 * and is within the range of an unsigned 16-bit integer.
	 *
	 * @param addr The IPv6 address of the socket
	 * @param port The unsigned 16-bit port number of the address
	 */
	public constructor(addr: Ipv6Addr, port: number) {
		this.addr = addr
		this.port = port
	}

	/**
	 * Attempts to create a new `SocketAddrV6`.
	 *
	 * This returns `null` if the port is not a valid unsigned 16-bit integer.
	 */
	public static tryNew(addr: Ipv6Addr, port: number): SocketAddrV6 | null {
		if (!isValidUint16(port)) {
			return null
		}

		return new SocketAddrV6(addr, port)
	}

	/**
	 * Parses a string in the format of `"[ipv6]:port"`,
	 * where the port is an unsigned 16-bit integer.
	 *
	 * TODO: Finish this implementation. This will currently
	 * throw an error since it is not implemented yet.
	 */
	public static parse(_s: string): SocketAddrV6 | null {
		throw new Error('Not implemented yet')
	}
}
