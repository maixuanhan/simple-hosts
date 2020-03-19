const { getIp, getHosts, set } = require('./index')

console.log("getIp('localhost'):", getIp('localhost'))
console.log("getIp('DESKTOP-26L9MT1.localdomain'):", getIp('DESKTOP-26L9MT1.localdomain'))
console.log("getIp('DESKTOP-26L9MT1'):", getIp('DESKTOP-26L9MT1'))
console.log("getIp('hanmai'):", getIp('hanmai'))
console.log("getIp('somehostname'):", getIp('somehostname'))
console.log("getIp('NON-EXIST'):", getIp('DESKTOP'))
console.log("getIp('127.0.1.1'):", getIp('127.0.1.1'))

console.log("getHosts('127.0.1.1'):", getHosts('127.0.1.1'))
console.log("getHosts('localhost'):", getHosts('localhost'))

set('10.201.200.89', 'MY-LOCAL-SERVER')

console.log("getIp('MY-LOCAL-SERVER'):", getIp('MY-LOCAL-SERVER'))
console.log("getHosts('10.201.200.89'):", getHosts('10.201.200.89'))
