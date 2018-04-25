const path = require('path');

module.exports = app => {
  return {

    view: {
      root: path.join(app.ROOT_PATH, 'app/views'),
      cache: true,
      defaultExtension: '.html',
      defaultViewEngine: '',
      mapping: {}
    }

  }
}