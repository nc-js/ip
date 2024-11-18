# Changelog

## 0.1.1 (2024-11-18)

- The parser for IPv4 addresses and socket addresses no longer takes as many ASCII digits as possible.
  - IPv4Addr: the parser will now only take 1 to 3 digits for each octet
  - SocketAddrV4: the parser will now only take 1 to 5 digits for the port number

## 0.1.0 (2024-11-17)

- Initial unstable release of library
