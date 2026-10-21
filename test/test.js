const expect = require('expect.js')
const fixtures = require('./fixtures')

function test (what, t) {
  describe(what, () => {
    it('index', t(require('../')[what]))
    it('direct', t(require('../cjs/' + what)))
  })
}

test('ftl2js', (fn) => (done) => {
  fn(fixtures.example.ftl, (err, res) => {
    expect(err).not.to.be.ok()
    expect(res).to.eql(fixtures.example.js)
    done()
  })
})

test('js2ftl', (fn) => (done) => {
  fn(fixtures.example.js, (err, res) => {
    expect(err).not.to.be.ok()
    expect(res).to.eql(fixtures.example.ftl)
    done()
  })
})

describe('without callback', () => {
  test('ftl2js', (fn) => (done) => {
    const res = fn(fixtures.example.ftl)
    expect(res).to.eql(fixtures.example.js)
    done()
  })

  test('js2ftl', (fn) => (done) => {
    const res = fn(fixtures.example.js)
    expect(res).to.eql(fixtures.example.ftl)
    done()
  })
})

describe('fixes', () => {
  const { ftl2js, js2ftl } = require('../')
  const roundTrip = (ftl) => expect(js2ftl(ftl2js(ftl))).to.eql(ftl)

  it('ftl2js keeps a message with attributes but no value', () => {
    const ftl = 'login-input =\n  .placeholder = email@example.com\n  .aria-label = Login input\n\n'
    expect(ftl2js(ftl)).to.eql({
      'login-input': { placeholder: 'email@example.com', 'aria-label': 'Login input' }
    })
    roundTrip(ftl)
  })

  it('js2ftl writes no value for an object without val', () => {
    expect(js2ftl({ 'login-input': { placeholder: 'email@example.com' } }))
      .to.eql('login-input =\n  .placeholder = email@example.com\n\n')
  })

  it('ftl2js keeps the attribute of a message reference', () => {
    const ftl = 'hint = Type { login-input.placeholder }\n\n'
    expect(ftl2js(ftl)).to.eql({ hint: 'Type { login-input.placeholder }' })
    roundTrip(ftl)
  })

  it('ftl2js keeps number literals in named arguments', () => {
    const ftl = 'price = { NUMBER($amount, minimumFractionDigits: 2, style: "percent") }\n\n'
    expect(ftl2js(ftl)).to.eql({ price: '{ NUMBER($amount, minimumFractionDigits: 2, style: "percent") }' })
    roundTrip(ftl)
  })

  it('ftl2js keeps the arguments of a term reference', () => {
    const ftl = '-brand = Firefox\n\nget = Get { -brand(case: "accusative") }\n\n'
    expect(ftl2js(ftl)).to.eql({ '-brand': 'Firefox', get: 'Get { -brand(case: "accusative") }' })
    roundTrip(ftl)
  })

  it('ftl2js keeps literal positional arguments of a function', () => {
    const ftl = 'answer = { NUMBER(42) } and { NUMBER(-0.5, style: "percent") }\n\n'
    expect(ftl2js(ftl)).to.eql({ answer: '{ NUMBER(42) } and { NUMBER(-0.5, style: "percent") }' })
    roundTrip(ftl)
  })
})
