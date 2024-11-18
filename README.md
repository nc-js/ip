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
import { assert, assertEquals } from '@std/assert'
import { IPv4Addr } from '@nc/net-addr/v4'

const ip1 = IPv4Addr.newAddr(127, 0, 0, 1)
const ip2 = IPv4Addr.tryFromUint8Array(new Uint8Array([127, 0, 0, 0, 1]))

assert(ip1.equals(ip2))
```

## License

This software is licensed under the MIT license ([`LICENSE`](./LICENSE) or
<https://opensource.org/license/mit/>).

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the MIT license, shall be
licensed as above, without any additional terms or conditions.
