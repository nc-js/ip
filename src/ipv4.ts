import { equals } from '@std/bytes/equals'
import type { IpAddrValue } from './ip.ts'
import { arrayStartsWith, takeAsciiDigits } from './utils.ts'

/**
 * A representation of an IPv4 address
 */
export class Ipv4Addr implements IpAddrValue {
	public static BROADCAST: Ipv4Addr = new Ipv4Addr(
		new Uint8Array([255, 255, 255, 255]),
	)
	public static LOCALHOST: Ipv4Addr = new Ipv4Addr(
		new Uint8Array([127, 0, 0, 1]),
	)
	public static UNSPECIFIED: Ipv4Addr = new Ipv4Addr(
		new Uint8Array([0, 0, 0, 0]),
	)

	public octets: Uint8Array
	private constructor(octets: Uint8Array) {
		this.octets = octets
	}

	public get a(): number {
		return this.octets[0]
	}

	public get b(): number {
		return this.octets[1]
	}

	public get c(): number {
		return this.octets[2]
	}

	public get d(): number {
		return this.octets[3]
	}

	public static newAddr(
		a: number,
		b: number,
		c: number,
		d: number,
	): Ipv4Addr {
		const bits = new Uint8ClampedArray([a, b, c, d])
		return new Ipv4Addr(
			new Uint8Array([bits[0], bits[1], bits[2], bits[3]]),
		)
	}

	public static fromUint32(n: number): Ipv4Addr {
		const u32 = Math.max(0, Math.min(4_294_967_295, n))
		return Ipv4Addr.newAddr(
			(u32 >>> 24) & 255,
			(u32 >>> 16) & 255,
			(u32 >>> 8) & 255,
			u32 & 255,
		)
	}

	public static parse(s: string): Ipv4Addr | undefined {
		const view = new DataView(new ArrayBuffer(4))
		let seenDots = 0
		let idx = 0

		while (seenDots <= 3) {
			const [octetString, newIdx] = takeAsciiDigits(s, idx)

			// parse octet
			const octetNumber: number = Number.parseInt(octetString, 10)
			if (octetNumber < 0 || octetNumber > 255) {
				return undefined
			}
			view.setUint8(seenDots, octetNumber)
			idx = newIdx

			// check for next dot
			if (seenDots < 3) {
				if (s[newIdx] !== '.') {
					return undefined
				}
				idx++
			}
			seenDots++
		}

		return Ipv4Addr.tryFromDataView(view)
	}

	public static tryFromArray(array: number[]): Ipv4Addr | undefined {
		if (array.length !== 4) {
			return undefined
		}

		return Ipv4Addr.newAddr(
			array[0],
			array[1],
			array[2],
			array[3],
		)
	}

	public static tryFromUint8Array(
		array: Uint8Array,
	): Ipv4Addr | undefined {
		return (array.length === 4) ? new Ipv4Addr(array) : undefined
	}

	public static tryFromDataView(view: DataView): Ipv4Addr | undefined {
		if (view.byteLength !== 4) {
			return undefined
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

	public toString(): string {
		return `${this.a}.${this.b}.${this.c}.${this.d}`
	}

	public previous(): Ipv4Addr | undefined {
		const n = uint8ArrayToUint32(this.octets) - 1
		if (n < 0) {
			return undefined
		}

		return Ipv4Addr.fromUint32(n)
	}

	public next(): Ipv4Addr | undefined {
		const n = uint8ArrayToUint32(this.octets) + 1
		if (n > 65535) {
			return undefined
		}

		return Ipv4Addr.fromUint32(n)
	}

	public equals(other: Ipv4Addr): boolean {
		return equals(this.octets, other.octets)
	}

	public isBenchmarking(): boolean {
		return this.a === 198 && (this.b & 0xfe) === 18
	}

	public isBroadcast(): boolean {
		return this.equals(Ipv4Addr.BROADCAST)
	}

	public isDocumentation(): boolean {
		return arrayStartsWith(this.octets, new Uint8Array([192, 0, 2])) ||
			arrayStartsWith(this.octets, new Uint8Array([198, 51, 100])) ||
			arrayStartsWith(this.octets, new Uint8Array([203, 0, 113]))
	}

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

	public isLinkLocal(): boolean {
		return arrayStartsWith(this.octets, new Uint8Array([169, 254]))
	}

	public isLoopback(): boolean {
		return this.a === 127
	}

	public isMulticast(): boolean {
		return this.a >= 224 && this.a <= 239
	}

	public isPrivate(): boolean {
		return (this.a === 10) ||
			(this.a === 172 && (this.b >= 16 && this.b <= 31)) ||
			(this.a === 192 && this.b === 168)
	}

	public isReserved(): boolean {
		return ((this.a & 240) === 240) && !this.isBroadcast()
	}

	public isShared(): boolean {
		return this.a === 100 && ((this.b & 0b1100_0000) === 0b0100_0000)
	}

	public isUnspecified(): boolean {
		return this.equals(Ipv4Addr.UNSPECIFIED)
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
