const path = require('path');

module.exports = {
  'astroboy-body': {
    priority: 3,
    enable: true,
    options: {
      formidable: {
        uploadDir: path.resolve('/tmp')
      },
      multipart: true,
      jsonLimit: '3mb',
      formLimit: '3mb',
      textLimit: '3mb',
      strict: false
    }
  }
};