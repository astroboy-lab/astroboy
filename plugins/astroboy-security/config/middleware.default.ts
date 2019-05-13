import { IAstroboySecurityPluginMiddlewareExtends } from '../contract';

const config: Partial<IAstroboySecurityPluginMiddlewareExtends> = {
  'astroboy-security-csrf': {
    priority: 2,
    enable: false,
    options: {
      env: ['prod'],
      excluded: ['GET', 'HEAD', 'OPTIONS'],
      csrfSecretName: 'csrf_secret',
      csrfTokenName: 'csrf_token',
      saltLength: 10,
      secretLength: 18,
      maxAge: 3 * 3600 * 1000,
    },
  },

  'astroboy-security-cto': {
    priority: 10,
    enable: true,
    options: 'nosniff',
  },

  'astroboy-security-frameOptions': {
    priority: 10,
    enable: true,
    options: 'SAMEORIGIN',
  },

  'astroboy-security-hsts': {
    priority: 10,
    enable: true,
    options: {
      maxAge: 365 * 24 * 3600,
    },
  },

  'astroboy-security-xss': {
    enable: true,
    priority: 20,
  },

  'astroboy-security-xssProtection': {
    priority: 10,
    enable: true,
    options: '1; mode=block',
  },
};

export = config;
