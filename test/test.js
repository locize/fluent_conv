const expect = require('expect.js');
const fixtures = require('./fixtures');

function test(what, t) {
  describe(what, () => {
    it('index', t(require('../')[what]));
    it('direct', t(require('../' + what)));
  });
}

test('ftl2js', (fn) => (done) => {
  fn(fixtures.example.ftl, (err, res) => {
    expect(err).not.to.be.ok();
    expect(res).to.eql(fixtures.example.js);
    done();
  });
});

test('js2ftl', (fn) => (done) => {
  fn(fixtures.example.js, (err, res) => {
    expect(err).not.to.be.ok();
    expect(res).to.eql(fixtures.example.ftl);
    done();
  });
});

describe('without callback', () => {
  test('ftl2js', (fn) => (done) => {
    const res = fn(fixtures.example.ftl);
    expect(res).to.eql(fixtures.example.js);
    done();
  });

  test('js2ftl', (fn) => (done) => {
    const res = fn(fixtures.example.js);
    expect(res).to.eql(fixtures.example.ftl);
    done();
  });
});
