import { Ipv4Addr } from './ipv4.ts'
import type { Ipv6Addr } from './ipv6.ts'
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
	 */
	public static fromString(s: string): SocketAddrV4 | undefined {
		const addr = Ipv4Addr.parse(s)
		if (addr === undefined) {
			return undefined
		}
		const afterAddr = addr.toString().length
		if (s[afterAddr + 1] !== ':') {
			return undefined
		}

		const [portStr, _] = takeAsciiDigits(s, afterAddr + 1)
		const portNum = Number.parseInt(portStr[0])
		if (Number.isNaN(portNum)) {
			return undefined
		}

		return new SocketAddrV4(addr, portNum)
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
	public static fromString(s: string): SocketAddrV6 | undefined {
		if (s[0] !== '[') {
			return undefined
		}

		return undefined
	}
}
