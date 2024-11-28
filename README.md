# @nc/net-addr

This library is a TypeScript port of Rust's network address types from the `std::net` module.

## Install
```shell
deno add jsr:@nc/net-addr  # deno
npx jsr add @nc/net-addr   # npm
```

## Usage
### IPv4 addresses
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

## License

This software is licensed under the MIT license ([`LICENSE`](./LICENSE) or
<https://opensource.org/license/mit/>).

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the MIT license, shall be
licensed as above, without any additional terms or conditions.
