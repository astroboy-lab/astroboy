import fs = require('fs-extra');

export function outputJsonSync(file: string, data: any, options = {}) {
  options = Object.assign(
    {
      spaces: 2,
      EOL: '\r\n',
    },
    options
  );
  fs.outputJsonSync(file, data, options);
}
