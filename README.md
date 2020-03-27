# simple-hosts

Easy way to manipulate the hosts file contents.

Why this?
- simple, lightweight
- synchronous => less error prone, don't need to chain with Promise
- support multiple hostname associated with a single IP address
- well tested before release
- transparent source code
- free of use

What's news?
- 1.1.0
    - Improve `set()` function to support new separate entry
- 1.2.0
    - Fix the `set()` function to support modifying existed hostname

This package provides the below synchronous functions
```ts
getIp(hostname: string): string
getHosts(ip: string): [string]
set(ip: string, hostname: string): void
```

*To be supported (if there is user requests in the future): remove IP address and/or hostname(s)*
