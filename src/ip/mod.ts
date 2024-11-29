/**
 * A module for IP addresses and IP address iterators.
 *
 * A high-level overview:
 *  - IPv4 addresses and IPv6 addresses are {@linkcode Ipv4Addr}
 *    and {@linkcode Ipv6Addr}.
 *  - It's possible to iterate through a range of addresses with
 *    {@linkcode Ipv4AddrIterator} and {@linkcode Ipv6AddrIterator}.
 *  - An {@linkcode IpAddr} is either an IPv4 or IPv6 address.
 *  - An {@linkcode IpAddrValue} is an interface for an IP address.
 * @module
 */

export * from './ip.ts'
export * from './ipv4.ts'
export * from './ipv6.ts'
export * from './iter.ts'
