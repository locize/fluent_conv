const fs = require('fs');
const path = require('path');

module.exports = {
  example: {
    js: require('./example.json'),
    ftl: fs.readFileSync(path.join(__dirname, 'example.ftl')).toString()
  }
};
