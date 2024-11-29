/**
 * A module for IP addresses, IP address iterators, and socket addresses.
 *
 * IP address-related types:
 *  - IPv4 addresses and IPv6 addresses are {@linkcode Ipv4Addr}
 *    and {@linkcode Ipv6Addr}.
 *  - It's possible to iterate through a range of addresses with
 *    {@linkcode Ipv4AddrIterator} and {@linkcode Ipv6AddrIterator}.
 *  - An {@linkcode IpAddr} is either an IPv4 or IPv6 address.
 *  - An {@linkcode IpAddrValue} is an interface for IP addresses.
 *
 * Socket-related types:
 *  - {@linkcode Port} is a simple newtype class over a port number (unsigned
 *    16-bit integer) with some built-in getters.
 *  - {@linkcode SocketAddrV4} contains an IPv4 address and port number.
 *  - {@linkcode SocketAddrV6} contains an IPv6 address, port number, flow info
 *    and scope ID.
 *  - {@linkcode SocketAddr} is either an IPv4 or IPv6 socket address.
 *  - {@linkcode SocketAddrValue} is an interface to represent a socket address.
 * @module
 */

export * from './ip/mod.ts'
export * from './socket.ts'
