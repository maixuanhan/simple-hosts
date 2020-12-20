"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHosts = exports.END_LINE = exports.DEFAULT_HOSTS_FILE_PATH = void 0;
var fs = require("fs");
exports.DEFAULT_HOSTS_FILE_PATH = process.platform === 'win32' ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';
exports.END_LINE = process.platform === 'win32' ? '\r\n' : '\n';
function read(path) {
    try {
        return fs.readFileSync(path, { encoding: 'utf8' });
    }
    catch (ex) {
        return "";
    }
}
function write(path, content) {
    return fs.writeFileSync(path, content, { encoding: 'utf8' });
}
function append(path, content) {
    return fs.appendFileSync(path, content, { encoding: 'utf8' });
}
/** Normalize and turn line into token strings
 * @param {string} line a line in hosts file
 * @returns {[string]}
 */
function lineToTokens(line) {
    return line.replace(/#.*/, '').trim().split(/\s+/);
}
var SimpleHosts = /** @class */ (function () {
    /** @param {string} path The hosts file path */
    function SimpleHosts(path) {
        if (path === void 0) { path = exports.DEFAULT_HOSTS_FILE_PATH; }
        this.hostsFilePath = path;
    }
    /** Get the IP address by an input hostname
     * @param {string} hostname
     * @returns {string} IP address or empty string if not found
     */
    SimpleHosts.prototype.getIp = function (hostname) {
        var ip = '';
        this.readLines().some(function (line) {
            var tokens = lineToTokens(line);
            if (tokens.some(function (token, index) { return index > 0 && token === hostname; })) {
                ip = tokens[0];
                return true;
            }
        });
        return ip;
    };
    /** Get hostnames by input ip address
     * @param {string} ip
     * @returns {[string]} List of hostnames
     */
    SimpleHosts.prototype.getHosts = function (ip) {
        var hosts = [];
        this.readLines().forEach(function (line) {
            var tokens = lineToTokens(line);
            if (tokens.length > 1 && tokens[0] === ip) {
                hosts.push.apply(hosts, tokens.slice(1));
            }
        });
        return hosts;
    };
    /** Set a record in hosts file
     * @param {string} ip
     * @param {string} hostname
     */
    SimpleHosts.prototype.set = function (ip, hostname) {
        if (this.getIp(hostname) !== ip) {
            var lines = this.readLines();
            var modifiedIndex_1 = -1;
            var newContent_1 = '';
            var deletedIndex_1 = -1;
            lines.some(function (line, index) {
                var tokens = lineToTokens(line);
                if (tokens.length == 2 && tokens[1] === hostname) {
                    deletedIndex_1 = index;
                    return true;
                }
                else if (tokens.length > 2) {
                    for (var i = 1; i < tokens.length; ++i) {
                        if (tokens[i] === hostname) {
                            modifiedIndex_1 = index;
                            tokens.splice(i, 1);
                            newContent_1 = tokens.join('\t');
                            return true;
                        }
                    }
                }
                return false;
            });
            if (deletedIndex_1 >= 0)
                lines.splice(deletedIndex_1, 1);
            else if (modifiedIndex_1 >= 0)
                lines[modifiedIndex_1] = newContent_1;
            lines.push(ip + "\t" + hostname);
            write(this.hostsFilePath, lines.join(exports.END_LINE));
        }
    };
    /** Remove records by IP address
     * @param {string} ip
     */
    SimpleHosts.prototype.removeIp = function (ip) {
        var lines = this.readLines();
        var newLines = [];
        lines.forEach(function (line) {
            var tokens = lineToTokens(line);
            if (!tokens.length || tokens[0] !== ip) {
                newLines.push(line);
            }
        });
        if (newLines.length !== lines.length) {
            write(this.hostsFilePath, newLines.join(exports.END_LINE));
        }
    };
    /** Remove records by hostname
     * @param {string} hostname
     */
    SimpleHosts.prototype.removeHost = function (hostname) {
        var lines = this.readLines();
        for (var i = lines.length - 1; i >= 0; --i) {
            var line = lines[i];
            var tokens = lineToTokens(line);
            var changed = false;
            for (var j = tokens.length - 1; j > 0; --j) {
                if (tokens[j] === hostname) {
                    tokens.splice(j, 1);
                    changed = true;
                }
            }
            if (tokens.length < 2) {
                lines.splice(i, 1);
            }
            else if (changed) {
                lines[i] = tokens.join('\t');
            }
        }
        write(this.hostsFilePath, lines.join(exports.END_LINE));
    };
    /** Remove a record in hosts file
     * @param {string} hostname
     */
    SimpleHosts.prototype.delete = function (hostname) {
        return this.removeHost(hostname);
    };
    SimpleHosts.prototype.readLines = function () {
        return read(this.hostsFilePath).split(/\r?\n/);
    };
    return SimpleHosts;
}());
exports.SimpleHosts = SimpleHosts;
