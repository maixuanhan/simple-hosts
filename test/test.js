const should = require('chai').should()
const SimpleHosts = require('../build/SimpleHosts').SimpleHosts
const fs = require('fs')
const END_LINE = require('../build/SimpleHosts').END_LINE

describe('Test getIp() function', function () {
    const h1 = new SimpleHosts('hosts1')
    it("getIp('localhost') should return '127.0.0.1'", function () {
        h1.getIp('localhost').should.equals('127.0.0.1')
    })
    it("getIp('DESKTOP-26L9MT1.localdomain') should return '127.0.1.1'", function () {
        h1.getIp('DESKTOP-26L9MT1.localdomain').should.equals('127.0.1.1')
    })
    it("getIp('DESKTOP-26L9MT1') should return '127.0.1.1'", function () {
        h1.getIp('DESKTOP-26L9MT1').should.equals('127.0.1.1')
    })
    it("getIp('DESKTOP-26L9MT2') should return '127.0.1.1'", function () {
        h1.getIp('DESKTOP-26L9MT2').should.equals('127.0.1.1')
    })
    it("getIp('hanmai') should return '127.0.1.1'", function () {
        h1.getIp('hanmai').should.equals('127.0.1.1')
    })
    it("getIp('NON-EXIST') should return ''", function () {
        h1.getIp('NON-EXIST').should.equals('')
    })
    it("getIp('127.0.1.1') should return ''", function () {
        h1.getIp('127.0.1.1').should.equals('')
    })
})

describe('Test getHosts() function', function () {
    const h1 = new SimpleHosts('hosts1')
    it("getHosts('127.0.1.1') should return 5 hosts", function () {
        h1.getHosts('127.0.1.1').should.have.length(5)
    })
    it("getHosts('127.0.1.1') should have 'DESKTOP-26L9MT1.localdomain'", function () {
        h1.getHosts('127.0.1.1').should.contain('DESKTOP-26L9MT1.localdomain')
    })
    it("getHosts('127.0.1.1') should have 'DESKTOP-26L9MT1'", function () {
        h1.getHosts('127.0.1.1').should.contain('DESKTOP-26L9MT1')
    })
    it("getHosts('127.0.1.1') should have 'DESKTOP-26L9MT2'", function () {
        h1.getHosts('127.0.1.1').should.contain('DESKTOP-26L9MT2')
    })
    it("getHosts('127.0.1.1') should have 'hanmai'", function () {
        h1.getHosts('127.0.1.1').should.contain('hanmai')
    })
    it("getHosts('127.0.1.1') should have 'somehostname'", function () {
        h1.getHosts('127.0.1.1').should.contain('somehostname')
    })
    it("getHosts('localhost') should return []", function () {
        h1.getHosts('localhost').should.be.an.instanceOf(Array).and.have.length(0)
    })
})

describe("Test set() function", function () {
    const filename = 'hosts2'
    before(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
        fs.writeFileSync(filename, '# Test hosts file')
    })
    after(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
    })
    const h2 = new SimpleHosts(filename)
    const verifier = new SimpleHosts(filename)
    it(`set('127.0.0.2', 'my-host') should add an record in the ${filename} file`, function () {
        h2.set('127.0.0.2', 'my-host')
        verifier.getHosts('127.0.0.2').should.contain('my-host')
    })
    it(`The previous record should be persistent in the ${filename} file`, function () {
        verifier.getHosts('127.0.0.2').should.contain('my-host')
    })
    it(`set('127.0.0.2', 'my-host') should not add new record to the ${filename} file`, function () {
        h2.set('127.0.0.2', 'my-host')
        verifier.getHosts('127.0.0.2').should.have.length(1)
    })
    it(`set('127.0.0.3', 'my-host3') should add an record in the ${filename} file`, function () {
        h2.set('127.0.0.3', 'my-host3')
        verifier.getHosts('127.0.0.3').should.contain('my-host3')
        verifier.getHosts('127.0.0.3').should.have.length(1)
    })
    it(`set('127.0.0.2', 'my-host2') should add an record in the ${filename} file (same IP, different hosts case)`, function () {
        h2.set('127.0.0.2', 'my-host2')
        verifier.getHosts('127.0.0.2').should.contain('my-host2')
        verifier.getHosts('127.0.0.2').should.have.length(2)
    })
})

describe("Test removeIp() function", function () {
    const filename = 'hosts2'
    before(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
        fs.writeFileSync(filename, '# Test hosts file' + END_LINE)
        fs.appendFileSync(filename, '127.0.0.3 my-host-1 my-host-2 my-host-3' + END_LINE)
    })
    after(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
    })
    const h2 = new SimpleHosts(filename)
    const verifier = new SimpleHosts(filename)
    it(`removeIp('127.0.0.1') should remove all records having IP 127.0.0.1 in ${filename} file`, function () {
        h2.set("127.0.0.1", "host1")
        h2.set("127.0.0.1", "host2")
        h2.set("127.0.0.2", "host3")
        verifier.getHosts('127.0.0.1').should.contain('host1')
        verifier.getHosts('127.0.0.1').should.contain('host2')
        verifier.getHosts('127.0.0.2').should.contain('host3')
        verifier.getHosts('127.0.0.3').should.contain('my-host-1')
        verifier.getHosts('127.0.0.3').should.contain('my-host-2')
        verifier.getHosts('127.0.0.3').should.contain('my-host-3')

        h2.removeIp("127.0.0.2")
        verifier.getHosts('127.0.0.2').should.not.contain('host3')
        h2.removeIp("127.0.0.1")
        verifier.getHosts('127.0.0.1').should.not.contain('host1')
        verifier.getHosts('127.0.0.1').should.not.contain('host2')
        h2.removeIp("127.0.0.3")
        verifier.getHosts('127.0.0.3').should.not.contain('my-host-1')
        verifier.getHosts('127.0.0.3').should.not.contain('my-host-2')
        verifier.getHosts('127.0.0.3').should.not.contain('my-host-3')
    })
})

describe("Test removeHost() function", function () {
    const filename = 'hosts2'
    before(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
        fs.writeFileSync(filename, '# Test hosts file' + END_LINE)
        fs.appendFileSync(filename, '127.0.0.3 my-host-1 my-host-2 my-host-3' + END_LINE)
    })
    after(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
    })
    const h2 = new SimpleHosts(filename)
    const verifier = new SimpleHosts(filename)
    it(`removeHost('my-host-1') should remove all records having my-host-1 in ${filename} file`, function () {
        h2.set("127.0.0.1", "host1")
        h2.set("127.0.0.1", "host2")
        h2.set("127.0.0.2", "host3")
        verifier.getHosts('127.0.0.1').should.contain('host1')
        verifier.getHosts('127.0.0.1').should.contain('host2')
        verifier.getHosts('127.0.0.2').should.contain('host3')
        verifier.getHosts('127.0.0.3').should.contain('my-host-1')
        verifier.getHosts('127.0.0.3').should.contain('my-host-2')
        verifier.getHosts('127.0.0.3').should.contain('my-host-3')

        h2.removeHost("my-host-1")
        verifier.getHosts('127.0.0.3').should.not.contain('my-host-1')
        verifier.getHosts('127.0.0.3').should.contain('my-host-2')
        verifier.getHosts('127.0.0.3').should.contain('my-host-3')

        h2.removeHost("host1")
        verifier.getHosts('127.0.0.1').should.not.contain('host1')
        verifier.getHosts('127.0.0.1').should.contain('host2')

        h2.removeHost("host3")
        verifier.getHosts('127.0.0.2').should.not.contain('host3')
    })
})

describe("Test delete() function", function () {
    const filename = 'hosts2'
    before(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
        fs.writeFileSync(filename, '# Test hosts file')
    })
    after(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
        }
    })
    const h2 = new SimpleHosts(filename)
    const verifier = new SimpleHosts(filename)
    it(`delete('my-host') after set('127.0.0.2', 'my-host')`, function () {
        h2.set('127.0.0.2', 'my-host')
        h2.delete('my-host')
        verifier.getHosts('127.0.0.2').should.eql([])
        verifier.getIp('my-host').should.equals('')
    })
    it(`delete should remove only one host`, function () {
        h2.set('127.0.0.3', 'my-host31')
        h2.set('127.0.0.3', 'my-host32')
        h2.set('127.0.0.3', 'my-host33')
        verifier.getHosts('127.0.0.3').should.have.length(3)
        h2.delete('my-host32')
        verifier.getHosts('127.0.0.3').should.have.length(2)
    })
    it(`delete should do nothing if host was not found`, function () {
        h2.set('127.0.0.3', 'my-host31')
        h2.set('127.0.0.3', 'my-host32')
        h2.set('127.0.0.3', 'my-host33')
        verifier.getHosts('127.0.0.3').should.have.length(3)
        h2.delete('my-host')
        verifier.getHosts('127.0.0.3').should.have.length(3)
    })
})
