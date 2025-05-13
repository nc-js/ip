import { isAsciiDigit } from '@nc/whatwg-infra/codePoints'

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
