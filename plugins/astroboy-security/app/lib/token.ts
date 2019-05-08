import * as crypto from 'crypto';
import { randomString } from './randomString';

export class Token {
  private options: any;
  private saltLength: number;
  private secretLength: number;

  get defaultOptions() {
    return {
      saltLength: 10,
      secretLength: 18,
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

  create(secret: any) {
    const salt = randomString(this.saltLength);
    return this.tokenize(secret, salt);
  }

  tokenize(secret: any, salt: any) {
    const hash = crypto
      .createHash('sha1')
      .update(secret, 'utf8')
      .digest('base64');

    return salt + '-' + hash;
  }

  verify(secret: any, token: any) {
    if (!secret || !token || typeof secret !== 'string' || typeof token !== 'string') {
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
