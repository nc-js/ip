import type { Ipv4Addr } from './ipv4.ts'
import type { Ipv6Addr } from './ipv6.ts'
import { parseIpv4Addr } from './parser.ts'
import { clampUint16, takeAsciiDigits } from './utils.ts'

/**
 * A socket address, containing an IPv4 address and a port number.
 */
export class SocketAddrV4 {
	/** The IPv4 address of the socket */
	public addr: Ipv4Addr
	/** The unsigned 16-bit port number of the address */
	public port: number

	/**
	 * Creates a new socket address from an IPv4 address and a port number.
	 * @param addr The IPv4 address of the socket
	 * @param port The unsigned 16-bit port number of the address
	 */
	public constructor(addr: Ipv4Addr, port: number) {
		this.addr = addr
		this.port = clampUint16(port)
	}

	/**
	 * Parses a string in the format of `"ipv4:port"`,
	 * where the port is an unsigned 16-bit integer.
	 *
	 * This will return null if:
	 * - The IPv4 address cannot be parsed.
	 * - The IPV4 address can be parsed, but there's no `:` delimiter.
	 * - The port number can't be parsed, or is out of bounds of an unsigned
	 *   16-bit integer (0 to 65,535).
	 */
	public static parse(s: string): SocketAddrV4 | null {
		const [addr, idx] = parseIpv4Addr(s)
		if (addr === null) {
			return null
		}

		const afterAddr = idx
		if (s[afterAddr] !== ':') {
			return null
		}

		const [portStr, _] = takeAsciiDigits(s, afterAddr + 1)
		const portNum = Number.parseInt(portStr, 10)
		if (Number.isNaN(portNum) || portNum > 65535) {
			return null
		}

		return new SocketAddrV4(addr, portNum)
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
	public addr: Ipv6Addr
	/** The unsigned 16-bit port number of the address */
	public port: number

	/**
	 * Creates a new socket address from an IPv6 address and a port number.
	 * @param addr The IPv6 address of the socket
	 * @param port The unsigned 16-bit port number of the address
	 */
	public constructor(addr: Ipv6Addr, port: number) {
		this.addr = addr
		this.port = clampUint16(port)
	}

	/**
	 * Parses a string in the format of `"[ipv6]:port"`,
	 * where the port is an unsigned 16-bit integer.
	 *
	 * TODO: Finish this implementation
	 */
	public static fromString(s: string): SocketAddrV6 | null {
		if (s[0] !== '[') {
			return null
		}

		return null
	}
}
