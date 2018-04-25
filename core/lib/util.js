const fs = require('fs-extra');

module.exports = {

  outputJsonSync(file, data, options = {}) {
    options = Object.assign({
      spaces: 2,
      EOL: '\r\n'
    }, options);
    fs.outputJsonSync(file, data, options);
  }

}