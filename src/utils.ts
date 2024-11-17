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

export function clampUint16(n: number): number {
	return Math.max(0, Math.min(65535, n))
}

export function uint8ArrayToUint32(array: ArrayLike<number>) {
	return (
		(array[0] << 24) |
		(array[1] << 16) |
		(array[2] << 8) |
		array[3]
	) >>> 0
}

export const isCodePointBetween = (
	value: string,
	low: number,
	max: number,
): boolean => {
	const codePoint = value.codePointAt(0)
	return (codePoint === undefined
		? false
		: codePoint >= low && codePoint <= max)
}

export const isAsciiDigit = (v: string): boolean =>
	isCodePointBetween(v, 0x0030, 0x0039)

export function takeAsciiDigits(
	s: string,
	at: number,
): [string, number] {
	let taken = ''
	let idx = at
	while (idx < s.length && isAsciiDigit(s[idx])) {
		taken += s[idx]
		idx++
	}
	return [taken, idx]
}
