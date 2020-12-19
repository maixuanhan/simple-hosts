export declare class SimpleHosts {
    private hostsFilePath;
    /** @param {string} path The hosts file path */
    constructor(path?: string);
    /** Get the IP address by an input hostname
     * @param {string} hostname
     * @returns {string} IP address or empty string if not found
     */
    getIp(hostname: string): string;
    /** Get hostnames by input ip address
     * @param {string} ip
     * @returns {[string]} List of hostnames
     */
    getHosts(ip: string): string[];
    /** Set a record in hosts file
     * @param {string} ip
     * @param {string} hostname
     */
    set(ip: string, hostname: string): void;
    /** Remove a record in hosts file
     * @param {string} hostname
     */
    delete(hostname: string): void;
}
