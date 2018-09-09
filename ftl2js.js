// const parser = require('./ftlparser');
const syntax = require('fluent-syntax');
const serializer = require('./ftl2jsSerializer');

function ftlToJs(str, cb) {
  if (typeof str !== 'string') {
    return cb(new Error('The first parameter was not a string'));
  }

  const parsed = syntax.parse(str, { withSpans: false });

  const result = parsed.body.reduce((mem, segment) => {
    const item = serializer.serialize(segment);
    if ((item.attributes && item.attributes.length) || item.comment) {
      const inner = {};
      if (item.comment) inner[item.comment.key] = item.comment.value;
      if (item.attributes && item.attributes.length) {
        item.attributes.forEach((attr) => {
          inner[attr.key] = attr.value;
        });
      }
      inner.val = item.value;

      mem[item.key] = inner;
    } else {
      mem[item.key] = item.value;
    }
    return mem;
  }, {});

  cb(null, result);
  return result;
}

module.exports = ftlToJs;
