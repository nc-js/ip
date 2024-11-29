# @nc/net-addr

A package of network addresses as types, including IPv4/IPv6 addresses, IP address iterators, and socket addresses. This TypeScript implementation mostly mirrors as a port of Rust's `std::net` module.

## Install
```sh
deno add jsr:@nc/net-addr  # deno
npx jsr add @nc/net-addr   # npm
```

## Usage
### IPv4 addresses
See [`Ipv4Addr`](https://jsr.io/@nc/net-addr/doc/~/Ipv4Addr) for more details.

It is also possible to iterate through ranges of IPv4 addresses with [`Ipv4AddrIterator`](https://jsr.io/@nc/net-addr/doc/~/Ipv4AddrIterator).

```ts
import { assertEquals } from '@std/assert'
import { Ipv4Addr } from '@nc/net-addr/ip'

const ip0 = Ipv4Addr.parse('127.0.0.1')
const ip1 = Ipv4Addr.tryNew(127, 0, 0, 1)
const ip2 = Ipv4Addr.tryFromArray([127, 0, 0, 1])
const ip3 = Ipv4Addr.tryFromUint32(2_130_706_433)
const ip4 = Ipv4Addr.tryFromUint8Array(new Uint8Array([127, 0, 0, 1]))

assertEquals(ip0, ip1)
assertEquals(ip0, ip2)
assertEquals(ip0, ip3)
assertEquals(ip0, ip4)
```

### IPv6 addresses
See [`Ipv6Addr`](https://jsr.io/@nc/net-addr/doc/~/Ipv6Addr) for more details.

It is also possible to iterate through ranges of IPv6 addresses with [`Ipv6AddrIterator`](https://jsr.io/@nc/net-addr/doc/~/Ipv6AddrIterator).

```ts
import { assert, assertEquals } from '@std/assert'
import { Ipv6Addr } from '@nc/net-addr/ip'

// parse() method is not implemented yet
const ip0 = Ipv6Addr.LOCALHOST
const ip1 = Ipv6Addr.tryNew(0, 0, 0, 0, 0, 0, 0, 1)
const ip2 = Ipv6Addr.tryFromUint128(1n)
const ip3 = Ipv6Addr.tryFromArray([0, 0, 0, 0, 0, 0, 0, 1])
const ip4 = Ipv6Addr.tryFromUint16Array(new Uint16Array([0, 0, 0, 0, 0, 0, 0, 1]))

assertEquals(ip0, ip1)
assertEquals(ip0, ip2)
assertEquals(ip0, ip3)
assertEquals(ip0, ip4)
```

### IPv4 socket addresses
See [`SocketAddrV4`](https://jsr.io/@nc/net-addr/doc/~/SocketAddrV4) for more details.

```ts
import { assertEquals } from '@std/assert'
import { Ipv4Addr } from '@nc/net-addr/ip'
import { Port, SocketAddrV4 } from '@nc/net-addr/socket'

const socket1 = new SocketAddrV4(Ipv4Addr.LOCALHOST, new Port(3000))
const socket2 = SocketAddrV4.parse("127.0.0.1:3000")

assertEquals(socket1, socket2)
assertEquals(socket1.addr, Ipv4Addr.LOCALHOST)
assertEquals(socket1.port.value, 3000)
assertEquals(socket1.toString(), "127.0.0.1:3000")
assertEquals(socket2?.toString(), "127.0.0.1:3000")
```

### IPv6 socket addresses
See [`SocketAddrV6`](https://jsr.io/@nc/net-addr/doc/~/SocketAddrV6) for more details.

```ts
import { assertEquals } from '@std/assert'
import { Ipv6Addr } from '@nc/net-addr/ip'
import { Port, SocketAddrV6 } from '@nc/net-addr/socket'

// callers must ensure that the flow info number and scope ID number
// are both valid unsigned 32-bit integers
const socket = new SocketAddrV6(
    Ipv6Addr.LOCALHOST,
    new Port(3000),
    0, // the flow info
    0, // the scope ID
)

assertEquals(socket.addr, Ipv6Addr.LOCALHOST)
assertEquals(socket.port.value, 3000)
assertEquals(socket.flowInfo, 0)
assertEquals(socket.scopeId, 0)
```

## License

This software is licensed under the MIT license ([`LICENSE`](./LICENSE) or
<https://opensource.org/license/mit/>).

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the MIT license, shall be
licensed as above, without any additional terms or conditions.
