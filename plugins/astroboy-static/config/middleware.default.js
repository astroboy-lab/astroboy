const path = require('path');

module.exports = {

  'astroboy-static': {
    priority: 3,
    enable: true,
    options: {
      root: path.resolve('/tmp/static')
    }
  }

}