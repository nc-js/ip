import { Ipv4Addr } from './ipv4.ts'
import { Ipv6Addr } from './mod.ts'

export interface IpAddrValue {
	equals(other: this): boolean
	isBenchmarking(): boolean
	isDocumentation(): boolean
	isLoopback(): boolean
	isMulticast(): boolean
	isUnspecified(): boolean
}

export class IpAddr implements IpAddrValue {
	public addr: IpAddrValue
	public constructor(addr: IpAddrValue) {
		this.addr = addr
	}

	isIpv4(): this is Ipv6Addr {
		return this.addr instanceof Ipv4Addr
	}

	isIpv6(): this is Ipv4Addr {
		return this.addr instanceof Ipv6Addr
	}

	equals(other: IpAddr): boolean {
		return this.addr.equals(other)
	}

	isBenchmarking(): boolean {
		return this.addr.isBenchmarking()
	}

	isDocumentation(): boolean {
		return this.addr.isDocumentation()
	}

	isLoopback(): boolean {
		return this.addr.isLoopback()
	}

	isMulticast(): boolean {
		return this.addr.isMulticast()
	}

	isUnspecified(): boolean {
		return this.addr.isUnspecified()
	}
}
