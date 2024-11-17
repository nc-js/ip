import { Ipv4Addr } from './ipv4.ts'
import type { Ipv6Addr } from './ipv6.ts'
import { clampUint16, takeAsciiDigits } from './utils.ts'

/**
 * A socket address, containing an IPv4 address and a port number.
 */
export class SocketAddrV4 {
	public addr: Ipv4Addr
	public port: number
	public constructor(addr: Ipv4Addr, port: number) {
		this.addr = addr
		this.port = clampUint16(port)
	}

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

export class SocketAddrV6 {
	public addr: Ipv6Addr
	public port: number
	public constructor(addr: Ipv6Addr, port: number) {
		this.addr = addr
		this.port = clampUint16(port)
	}

	public static fromString(s: string): SocketAddrV6 | undefined {
		if (s[0] !== '[') {
			return undefined
		}

		return undefined
	}
}
