const fs = require('fs')

const HOSTS_FILE_PATH = process.platform === 'win32' ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts'
// const HOSTS_FILE_PATH = './hosts'
const ENDLINE = process.platform === 'win32' ? '\r\n' : '\n'

function read(path) {
    return fs.readFileSync(path, { encoding: 'utf8' })
}

function write(path, content) {
    return fs.writeFileSync(path, content, { encoding: 'utf8' })
}

function append(path, content) {
    return fs.appendFileSync(path, content, { encoding: 'utf8' })
}

/** Normalize and turn line into token strings
 * @param {string} line a line in hosts file
 * @returns {[string]}
 */
function lineToTokens(line) {
    return line.replace(/#.*/, '').trim().split(/\s+/)
}

/** Get the IP address by an input hostname
 * @param {string} hostname
 * @returns {string} IP address or empty string if not found
 */
function getIp(hostname) {
    let ip = ''
    read(HOSTS_FILE_PATH).split(/\r?\n/).some(line => {
        let tokens = lineToTokens(line)
        let found = tokens.some((token, index) => {
            if (index > 0 && token === hostname) {
                return true
            }
        })

        if (found) {
            ip = tokens[0]
            return true
        }
    })
    return ip
}

/** Get hostnames by input ip address
 * @param {string} ip
 * @returns {[string]} List of hostnames
 */
function getHosts(ip) {
    let hosts = []
    read(HOSTS_FILE_PATH).split(/\r?\n/).forEach(line => {
        let tokens = lineToTokens(line)
        if (tokens.length > 0 && tokens[0] === ip) {
            for (let i = 1; i < tokens.length; ++i) {
                hosts.push(tokens[i])
            }
        }
    })
    return hosts
}

/** Set a record in hosts file
 * @param {string} ip
 * @param {string} hostname
 */
function set(ip, hostname) {
    let existedIp = getIp(hostname)
    if (existedIp !== ip) {
        let lines = read(HOSTS_FILE_PATH).split(/\r?\n/)
        let modifiedIndex = -1
        let newContent = ''
        let deletedIndex = -1
        lines.some((line, index) => {
            let tokens = lineToTokens(line)
            if (tokens.length == 2 && tokens[1] === hostname) {
                deletedIndex = index
                return true
            }
            else if (tokens.length > 2) {
                for (let i = 1; i < tokens.length; ++i) {
                    if (tokens[i] === hostname) {
                        modifiedIndex = index
                        tokens.splice(i, 1)
                        newContent = tokens.join('\t')
                        return true
                    }
                }
            }
            return false
        })

        if (deletedIndex >= 0)
            lines.splice(deletedIndex, 1);
        else if (modifiedIndex >= 0)
            lines[modifiedIndex] = newContent

        lines.push(`${ip}\t${hostname}`)

        write(HOSTS_FILE_PATH, lines.join(ENDLINE))
    }
}

module.exports = { getIp, getHosts, set }
