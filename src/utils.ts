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

export function clampUint8(n: number): number {
	return Math.max(0, Math.min(255, Math.trunc(n)))
}

export function clampUint16(n: number): number {
	return Math.max(0, Math.min(65535, Math.trunc(n)))
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
): [string, number] {
	let taken = ''
	let idx = at
	while (idx < s.length && isAsciiDigit(s[idx])) {
		taken += s[idx]
		idx++
	}
	return [taken, idx]
}
