# simple-hosts

Easy way to manipulate the hosts file contents.

Why this?
- simple, lightweight
- synchronous => 
    - less error prone over other library since they open the small file for very long time which may cause file corruption
    - ease of use, don't need to chain with Promise
- support multiple hostname associated with a single IP address
- well tested before release
- transparent source code
- free of use

What's news?
- 1.1.0
    - Improve `set()` function to support new separate entry
- 1.2.0
    - Fix the `set()` function to support modifying existed hostname
- 1.2.1
    - Refactor the source code. Create `SimpleHosts` class supporting input hosts file path
    - Add test cases
    - Update document
- 1.2.2
    - Use typescript
- 1.2.3
    - Support remove records by IP or hostname with `removeIp()` and `removeHost()` function


This package provides the below synchronous functions

1. Get corresponding IP of a hostname
    ```ts
    getIp(hostname: string): string
    ```
    Returns the corresponding IP that is mapped to the input hostname. If no record is found, it will return an empty string. If there are multiple IPs that are mapped to a same hostname, the first IP will be returned. Multiple IPs for a same hostname is not encouraged because it causes ambiguous

1. Get corresponding hostnames of an IP
    ```ts
    getHosts(ip: string): string[]
    ```
    Returns an array of found hostnames that are mapped to the input IP

1. Create or modify a record in hosts file
    ```ts
    set(ip: string, hostname: string): void
    ```
    If the same record that contains same IP and same hostname has been in the hosts file, no additional writing is performed. If the hostname has been already existed, it will be removed from the map of current IP and then new record will be added.

1. Remove records by ID address
    ```ts
    removeIp(ip: string): void
    ```

1. Remove records by hostname
    ```ts
    removeHost(hostname: string): void
    ```
