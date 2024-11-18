import { randomIntegerBetween } from '@std/random'

export function randomAddress(): string {
	let segments: string[] = []
	for (let i = 0; i < 4; i++) {
		segments.push(randomIntegerBetween(0, 255).toString(10))
	}

	return segments.join('.')
}

export function randomPort(): string {
	return randomIntegerBetween(0, 65535).toString(10)
}
