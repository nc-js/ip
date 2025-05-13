import { assert } from '@std/assert/assert'
import { assertFalse } from '@std/assert/false'
import { assertInstanceOf } from '@std/assert/instance-of'
import { randomIntegerBetween } from '@std/random/integer-between'
import { Port } from './socket.ts'

Deno.test('port: create a system port', () => {
	const port = Port.tryNew(randomIntegerBetween(0, 1023))
	assertInstanceOf(port, Port)
	assert(port.isSystem)
})

Deno.test('port: create a user port', () => {
	const port = Port.tryNew(randomIntegerBetween(1024, 49151))
	assertInstanceOf(port, Port)
	assert(port.isUser)
})

Deno.test('port: create a dynamic port', () => {
	const port = Port.tryNew(randomIntegerBetween(49152, 65535))
	assertInstanceOf(port, Port)
	assert(port.isDynamic)
})

Deno.test('port: create a reserved port', () => {
	assert(new Port(0).isReserved)
	assert(new Port(1023).isReserved)
	assert(new Port(1024).isReserved)
	assert(new Port(1023).isReserved)
	assert(new Port(49151).isReserved)
	assert(new Port(49152).isReserved)
	assert(new Port(65535).isReserved)
	assertFalse(new Port(5).isReserved)
})

Deno.test('port: create a selectable ephemeral port', () => {
	const port = Port.tryNew(randomIntegerBetween(1024, 65535))
	assertInstanceOf(port, Port)
	assert(port.isSelectableEphemeral)

	// to be safe, check min and max
	const minPort = new Port(1024)
	assert(minPort.isSelectableEphemeral)

	const maxPort = new Port(65535)
	assert(maxPort.isSelectableEphemeral)
})
