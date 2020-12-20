"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHosts = void 0;
var fs = require("fs");
var HOSTS_FILE_PATH = process.platform === 'win32' ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';
var ENDLINE = process.platform === 'win32' ? '\r\n' : '\n';
function read(path) {
    return fs.readFileSync(path, { encoding: 'utf8' });
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
        if (path === void 0) { path = HOSTS_FILE_PATH; }
        this.hostsFilePath = path;
    }
    /** Get the IP address by an input hostname
     * @param {string} hostname
     * @returns {string} IP address or empty string if not found
     */
    SimpleHosts.prototype.getIp = function (hostname) {
        var ip = '';
        read(this.hostsFilePath).split(/\r?\n/).some(function (line) {
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
        read(this.hostsFilePath).split(/\r?\n/).forEach(function (line) {
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
            var lines = read(this.hostsFilePath).split(/\r?\n/);
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
            write(this.hostsFilePath, lines.join(ENDLINE));
        }
    };
    /** Remove a record in hosts file
     * @param {string} hostname
     */
    SimpleHosts.prototype.delete = function (hostname) {
        if (this.getIp(hostname) !== '') {
            var lines = read(this.hostsFilePath).split(/\r?\n/);
            var deletedIndex_2 = -1;
            lines.some(function (line, index) {
                var tokens = lineToTokens(line);
                if (tokens.length == 2 && tokens[1] === hostname) {
                    deletedIndex_2 = index;
                    return true;
                }
                return false;
            });
            if (deletedIndex_2 >= 0)
                lines.splice(deletedIndex_2, 1);
            write(this.hostsFilePath, lines.join(ENDLINE));
        }
    };
    return SimpleHosts;
}());
exports.SimpleHosts = SimpleHosts;
