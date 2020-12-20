import * as fs from 'fs';

export const DEFAULT_HOSTS_FILE_PATH =
    process.platform === 'win32' ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

export const END_LINE = process.platform === 'win32' ? '\r\n' : '\n';

function read(path: string): string {
    try {
        return fs.readFileSync(path, { encoding: 'utf8' });
    } catch (ex) {
        return "";
    }
}

function write(path: string, content: string) {
    return fs.writeFileSync(path, content, { encoding: 'utf8' });
}

function append(path: string, content: string) {
    return fs.appendFileSync(path, content, { encoding: 'utf8' });
}

/** Normalize and turn line into token strings
 * @param {string} line a line in hosts file
 * @returns {[string]}
 */
function lineToTokens(line: string) {
    return line.replace(/#.*/, '').trim().split(/\s+/);
}

export class SimpleHosts {
    private hostsFilePath: string;

    /** @param {string} path The hosts file path */
    constructor(path: string = DEFAULT_HOSTS_FILE_PATH) {
        this.hostsFilePath = path;
    }

    /** Get the IP address by an input hostname
     * @param {string} hostname
     * @returns {string} IP address or empty string if not found
     */
    getIp(hostname: string): string {
        let ip = '';
        this.readLines().some(line => {
            let tokens = lineToTokens(line);
            if (tokens.some((token, index) => { return index > 0 && token === hostname })) {
                ip = tokens[0];
                return true;
            }
        })
        return ip;
    }

    /** Get hostnames by input ip address
     * @param {string} ip
     * @returns {[string]} List of hostnames
     */
    getHosts(ip: string): string[] {
        let hosts: string[] = [];
        this.readLines().forEach(line => {
            let tokens = lineToTokens(line);
            if (tokens.length > 1 && tokens[0] === ip) {
                hosts.push(...tokens.slice(1));
            }
        });
        return hosts;
    }

    /** Set a record in hosts file
     * @param {string} ip
     * @param {string} hostname
     */
    set(ip: string, hostname: string) {
        if (this.getIp(hostname) !== ip) {
            let lines = this.readLines();
            let modifiedIndex = -1;
            let newContent = '';
            let deletedIndex = -1;
            lines.some((line, index) => {
                let tokens = lineToTokens(line);
                if (tokens.length == 2 && tokens[1] === hostname) {
                    deletedIndex = index;
                    return true;
                }
                else if (tokens.length > 2) {
                    for (let i = 1; i < tokens.length; ++i) {
                        if (tokens[i] === hostname) {
                            modifiedIndex = index;
                            tokens.splice(i, 1);
                            newContent = tokens.join('\t');
                            return true;
                        }
                    }
                }
                return false;
            });

            if (deletedIndex >= 0)
                lines.splice(deletedIndex, 1);
            else if (modifiedIndex >= 0)
                lines[modifiedIndex] = newContent;

            lines.push(`${ip}\t${hostname}`);

            write(this.hostsFilePath, lines.join(END_LINE));
        }
    }

    /** Remove records by IP address
     * @param {string} ip
     */
    removeIp(ip: string) {
        const lines = this.readLines();
        const newLines: string[] = [];
        lines.forEach(line => {
            let tokens = lineToTokens(line);
            if (!tokens.length || tokens[0] !== ip) {
                newLines.push(line);
            }
        });

        if (newLines.length !== lines.length) {
            write(this.hostsFilePath, newLines.join(END_LINE));
        }
    }

    /** Remove records by hostname
     * @param {string} hostname
     */
    removeHost(hostname: string) {
        let lines = this.readLines();
        for (let i = lines.length - 1; i >= 0; --i) {
            const line = lines[i];
            let tokens = lineToTokens(line);
            let changed = false;
            for (let j = tokens.length - 1; j > 0; --j) {
                if (tokens[j] === hostname) {
                    tokens.splice(j, 1);
                    changed = true;
                }
            }
            if (tokens.length < 2) {
                lines.splice(i, 1);
            } else if (changed) {
                lines[i] = tokens.join('\t');
            }
        }

        write(this.hostsFilePath, lines.join(END_LINE));
    }

    /** Remove a record in hosts file
     * @param {string} hostname
     */
    delete(hostname: string) {
        return this.removeHost(hostname);
    }

    private readLines(): string[] {
        return read(this.hostsFilePath).split(/\r?\n/);
    }
}
