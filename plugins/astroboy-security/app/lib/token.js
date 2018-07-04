const crypto = require('crypto');
const randomString = require('./randomString');

class Token {

  get defaultOptions() {
    return {
      saltLength: 10,
      secretLength: 18
    };
  }

  constructor(options = {}) {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.saltLength = this.options.saltLength;
    this.secretLength = this.options.secretLength;
  }

  secretSync() {
    return randomString(this.secretLength);
  }

  create(secret) {
    const salt = randomString(this.saltLength);
    return this.tokenize(secret, salt);
  }

  tokenize(secret, salt) {
    const hash = crypto
      .createHash('sha1')
      .update(secret, 'utf-8')
      .digest('base64');

    return salt + '-' + hash;
  }

  verify(secret, token) {
    if (!secret || !token ||
      typeof secret !== 'string' ||
      typeof token !== 'string') {
      return false;
    }

    const index = token.indexOf('-');
    if (index === -1) {
      return false;
    }
    const salt = token.substr(0, index);
    const expected = this.tokenize(secret, salt);

    return expected === token;
  }

}

module.exports = Token;