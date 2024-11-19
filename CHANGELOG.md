# Changelog

## 0.2.0 (2024-11-18)

### Breaking changes

- The interface `IpAddrValue` now exposes an `octets()` method that returns a `Uint8Array`.
- The properties of `Ipv4Addr` and `Ipv6Addr` are now readonly.
- The properties of `SocketAddrV4` and `SocketAddrV6` are now readonly.
- `SocketAddrV6.fromString()` is renamed to `SocketAddrV6.parse()` to be consistent with `SocketAddrV4.parse()`. (**Note**: This method is not currently implemented yet, and will throw an error when called)

### Features

- `SocketAddrV4` and `SocketAddrV6` now exposes a static `tryNew()` method. This method will check if the port number is a valid, unsigned 16-bit integer.
- `SocketAddrV4` and `SocketAddrV6` now have a note on their constructors which states that the caller is responsible for checking that the port is a valid, unsigned 16-bit integer.

## 0.1.1 (2024-11-18)

- The parser for IPv4 addresses and socket addresses no longer takes as many ASCII digits as possible.
  - IPv4Addr: the parser will now only take 1 to 3 digits for each octet
  - SocketAddrV4: the parser will now only take 1 to 5 digits for the port number

## 0.1.0 (2024-11-17)

- Initial unstable release of library
