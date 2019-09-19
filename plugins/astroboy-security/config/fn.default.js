module.exports = {
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

  'astroboy-security-xssProtection': {
    priority: 10,
    enable: true,
    options: '1; mode=block',
  },

  //   'astroboy-security-xss': {
  //     enable: true,
  //     priority: 20,
  //     options: {},
  //   },
};
