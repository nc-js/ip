# Changelog

## 0.2.0 (2024-11-18)

- The interface `IpAddrValue` now exposes an `octets()` method that returns a `Uint8Array`.
- To prevent internal mutability of `IPv4Addr` and `IPv6Addr`, `IPv4Addr.octets` and `IPv6Addr.segments` are now readonly.

## 0.1.1 (2024-11-18)

- The parser for IPv4 addresses and socket addresses no longer takes as many ASCII digits as possible.
  - IPv4Addr: the parser will now only take 1 to 3 digits for each octet
  - SocketAddrV4: the parser will now only take 1 to 5 digits for the port number

## 0.1.0 (2024-11-17)

- Initial unstable release of library
