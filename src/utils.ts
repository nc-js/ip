export function arrayStartsWith(
	a: ArrayLike<number>,
	b: ArrayLike<number>,
): boolean {
	if (b.length > a.length) {
		return false
	}

	for (let i = 0; i < b.length; i++) {
		if (a[i] !== b[i]) return false
	}

	return true
}

export function isValidUint8(n: number): boolean {
	return n >= 0 && n <= 255 && Number.isInteger(n)
}

export function isValidUint16(n: number): boolean {
	return n >= 0 && n <= 65_535 && Number.isInteger(n)
}

export function isValidUint32(n: number): boolean {
	return n >= 0 && n <= 4_294_967_295 && Number.isInteger(n)
}

export function isValidUint128(n: bigint): boolean {
	return n >= 0 && n <= ((2n ** 128n) - 1n)
}

function isCodePointBetween(
	value: string,
	low: number,
	max: number,
): boolean {
	const codePoint = value.codePointAt(0) as number
	return codePoint >= low && codePoint <= max
}

export function isAsciiDigit(v: string): boolean {
	return isCodePointBetween(v, 0x0030, 0x0039)
}

export function takeAsciiDigits(
	s: string,
	at: number,
	atLeast: number,
	atMost: number,
): [string, number] {
	let taken = ''
	let idx = at

	while (idx < s.length && taken.length < atMost && isAsciiDigit(s[idx])) {
		taken += s[idx]
		idx++
	}

	if (taken.length < atLeast) {
		return ['', idx]
	}

	return [taken, idx]
}
